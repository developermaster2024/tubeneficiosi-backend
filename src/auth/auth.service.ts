import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/clientes/entities/client.entity';
import { Store } from 'src/stores/entities/store.entity';
import { HashingService } from 'src/support/hashing.service';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/roles.enum';
import { Repository } from 'typeorm';
import { RegisterClientDto } from './dto/register-client.dto';
import { RegisterStoreDto } from './dto/register-store.dto';

type RegisterResponse = {user: User; accessToken: string};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async validateUser(email: string, password: string, role: Role): Promise<Partial<User>> {
    const user = await this.usersRepository.findOne({
      where: {email, role},
      relations: ['client', 'store'],
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
    });

    user.client = Object.assign(new Client(), {name, phoneNumber});

    user = await this.usersRepository.save(user);

    const {password, ...userWithoutPassword} = user;

    return {
      user,
      accessToken: this.jwtService.sign({...userWithoutPassword}),
    };
  }

  async registerStore({email, password, ...storeData}: RegisterStoreDto): Promise<RegisterResponse> {
    let user = User.create({
      email,
      password: await this.hashingService.make(password),
      role: Role.STORE,
    });

    user.store = Store.create(storeData);

    user = await this.usersRepository.save(user);

    const {password: hashedPassword, ...userWithoutPassword} = user;

    return {
      user,
      accessToken: this.jwtService.sign({...userWithoutPassword}),
    };
  }
}
