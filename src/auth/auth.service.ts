import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/clientes/entities/client.entity';
import { HashingService } from 'src/support/hashing.service';
import { User } from 'src/users/entities/user.entity';
import { Roles } from 'src/users/enums/roles.enum';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async validateUser(email: string, password: string): Promise<Partial<User>> {
    const user = await this.usersRepository.findOne({
      where: {email},
      relations: ['client'],
    })

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

  async register({name, phoneNumber, ...registerUserDto}: RegisterUserDto): Promise<{user: User; accessToken: string}> {
    let user = Object.assign(new User(), {
      ...registerUserDto,
      password: await this.hashingService.make(registerUserDto.password),
      role: Roles.CLIENT,
    });

    user.client = Object.assign(new Client(), {name, phoneNumber});

    user = await this.usersRepository.save(user);

    const {password, ...userWithoutPassword} = user;

    return {
      user,
      accessToken: this.jwtService.sign({...userWithoutPassword}),
    };
  }
}
