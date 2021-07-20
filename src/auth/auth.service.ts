import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { parse } from 'date-fns';
import { Client } from 'src/clients/entities/client.entity';
import { StoreHour } from 'src/store-hours/entities/store-hour.entity';
import { Store } from 'src/stores/entities/store.entity';
import { HashingService } from 'src/support/hashing.service';
import { Days } from 'src/support/types/days.enum';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/roles.enum';
import { UserStatuses } from 'src/users/enums/user-statuses.enum';
import { Repository } from 'typeorm';
import { RegisterClientDto } from './dto/register-client.dto';
import { RegisterStoreDto } from './dto/register-store.dto';

type RegisterResponse = {user: User; accessToken: string};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(StoreHour) private readonly storeHourRepository: Repository<StoreHour>,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
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

    return {
      user,
      accessToken: this.jwtService.sign({...userWithoutPassword}),
    };
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

    const storeHours = Object.keys(Days).filter(key => key !== Days.SATURDAY && key !== Days.SUNDAY).map(key => StoreHour.create({
      day: Days[key],
      isWorkingDay: true,
      startTime: parse('08:00:00', 'HH:mm:ss', new Date()),
      endTime: parse('16:30:00', 'HH:mm:ss', new Date()),
      store: user.store,
    }));

    await this.storeHourRepository.save(storeHours);

    const {password: hashedPassword, ...userWithoutPassword} = user;

    return {
      user,
      accessToken: this.jwtService.sign({...userWithoutPassword}),
    };
  }
}
