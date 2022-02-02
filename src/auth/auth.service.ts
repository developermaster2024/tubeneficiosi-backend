import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { parse } from 'date-fns';
import { Client } from 'src/clients/entities/client.entity';
import { MailService } from 'src/mail/mail.service';
import { Notification } from 'src/notifications/entities/notification.entity';
import { UserToNotification } from 'src/notifications/entities/user-to-notification.entity';
import { NotificationTypes } from 'src/notifications/enums/notification-types.enum';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { NotificationsService } from 'src/notifications/notifications.service';
import { StoreHour } from 'src/store-hours/entities/store-hour.entity';
import { Store } from 'src/stores/entities/store.entity';
import { HashingService } from 'src/support/hashing.service';
import { Days } from 'src/support/types/days.enum';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/roles.enum';
import { UserStatuses } from 'src/users/enums/user-statuses.enum';
import { UserNotFoundException } from 'src/users/errors/user-not-found.exception';
import { Repository } from 'typeorm';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RegisterClientDto } from './dto/register-client.dto';
import { RegisterStoreDto } from './dto/register-store.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordReset } from './entities/password-reset.entity';
import { InvalidCredentialsException } from './errors/invalid-credentials.exception';

type RegisterResponse = {user: User; accessToken: string};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(StoreHour) private readonly storeHourRepository: Repository<StoreHour>,
    @InjectRepository(PasswordReset) private readonly passwordResetsRepository: Repository<PasswordReset>,
    @InjectRepository(Notification) private readonly notificationsRepository: Repository<Notification>,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
    private readonly mailService: MailService,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly notificationsService: NotificationsService,
  ) {}

  async validateUser(email: string, password: string, role: Role): Promise<Partial<User>> {
    const user = await this.usersRepository.findOne({
      where: {email, role},
      relations: ['client', 'store', 'admin', 'userStatus'],
    });

    if (!user) {
      return null;
    }

    const {password: userPassword, ...restOfUser} = user;

    const passwordMatches = await this.hashingService.check(password, userPassword);

    if (!passwordMatches) {
      return null;
    }

    return restOfUser;
  }

  login(user: User) {
    return {
      user,
      accessToken: this.jwtService.sign(user)
    };
  }

  async register({name, phoneNumber, ...registerUserDto}: RegisterClientDto): Promise<RegisterResponse> {
    let user = Object.assign(new User(), {
      ...registerUserDto,
      password: await this.hashingService.make(registerUserDto.password),
      role: Role.CLIENT,
      userStatusCode: UserStatuses.ACTIVE,
    });

    user.client = Object.assign(new Client(), {name, phoneNumber});

    user = await this.usersRepository.save(user);

    const {password, ...userWithoutPassword} = user;

    const userToNotifications = (await this.getAdmins()).map(admin => UserToNotification.create({ userId: admin.id }));

    const notification = await this.notificationsRepository.save(Notification.create({
      message: 'Nuevo cliente registrado',
      type: NotificationTypes.REGISTERED_CUSTOMER,
      additionalData: { clientId: user.id },
      userToNotifications,
    }));

    this.notificationsGateway.notifyUsersById(userToNotifications.map(utn => utn.userId), notification.toDto());

    return {
      user,
      accessToken: this.jwtService.sign({...userWithoutPassword}),
    };
  }

  async getAdmins(): Promise<User[]> {
    return await this.usersRepository.find({ role: Role.ADMIN });
  }

  async registerStore({email, password, latitude, longitude, ...storeData}: RegisterStoreDto): Promise<RegisterResponse> {
    let user = User.create({
      email,
      password: await this.hashingService.make(password),
      role: Role.STORE,
      userStatusCode: UserStatuses.ACTIVE,
    });

    user.store = Store.create({
      ...storeData,
      latitude,
      longitude,
      location: `POINT(${latitude} ${longitude})`,
    });

    user = await this.usersRepository.save(user);

    const storeHours = Object.keys(Days).map(key => StoreHour.create({
      day: Days[key],
      isWorkingDay: key !== Days.SATURDAY && key !== Days.SUNDAY,
      startTime: parse('08:00:00', 'HH:mm:ss', new Date()),
      endTime: parse('16:30:00', 'HH:mm:ss', new Date()),
      store: user.store,
    }));

    await this.storeHourRepository.save(storeHours);

    const {password: hashedPassword, ...userWithoutPassword} = user;

    const clients = await this.usersRepository.find({
      select: ['id'],
      where: { role: Role.CLIENT },
    });

    const usersToNotify = clients.concat(await this.getAdmins());

    const userToNotifications = usersToNotify.map(admin => UserToNotification.create({ userId: admin.id }));

    const notification = await this.notificationsRepository.save(Notification.create({
      message: 'Pulsa aqui para ver sus productos',
      type: NotificationTypes.REGISTERED_STORE,
      additionalData: { storeId: user.store.id },
      userToNotifications,
    }));

    const userIds = userToNotifications.map(utn => utn.userId);

    this.notificationsGateway.notifyUsersById(userIds, notification.toDto());
    await this.notificationsService.notifyUsersById(userIds, notification);

    return {
      user,
      accessToken: this.jwtService.sign({...userWithoutPassword}),
    };
  }

  async forgotPassword({email}: ForgotPasswordDto, role: Role): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { email, role },
      relations: ['client', 'store'],
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    const token = this.jwtService.sign({id: user.id, email: user.email}, {expiresIn: '12h'});

    const passwordReset = PasswordReset.create({ email, token });

    await this.passwordResetsRepository.save(passwordReset);

    const fullName = role === Role.CLIENT ? user.client.name : user.store.name;

    await this.mailService.sendForgotPasswordEmail({email, token, fullName, role});
  }

  async resetPassword({email, password, token}: ResetPasswordDto, role: Role): Promise<void> {
    // Chequear que exista un registro en password_resets con el email y token
    const passwordReset = await this.passwordResetsRepository.findOne({email, token});

    if (!passwordReset) {
      throw new InvalidCredentialsException();
    }

    // Chequear que el token sea valido
    const tokenIsValid = this.jwtService.verify(token);

    if (!tokenIsValid) {
      throw new InvalidCredentialsException();
    }

    // Cambiar contraseña
    const user = await this.usersRepository.findOne({ email, role });

    if (!user) {
      throw new InvalidCredentialsException();
    }

    user.password = await this.hashingService.make(password);

    await this.usersRepository.save(user);

    // Eliminar el registro de password_resets
    await this.passwordResetsRepository.remove(passwordReset);
  }
}
