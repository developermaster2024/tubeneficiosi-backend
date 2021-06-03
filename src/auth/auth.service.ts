import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { HashingService } from 'src/support/hashing.service';
import { ReadUserDto } from 'src/users/dto/read-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { RegisterResponseDto } from './dto/register-response.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly hashingService: HashingService,
  ) {}

  async validateUser(email: string, password: string): Promise<Partial<User>> {
    const user = await this.usersService.findOneByEmail(email);

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
      ...user,
      accessToken: this.jwtService.sign(user)
    };
  }

  async register(registerUserDto: RegisterUserDto): Promise<RegisterResponseDto> {
    const user = await this.usersService.create(registerUserDto);

    return {
      user,
      accessToken: this.jwtService.sign({...user}),
    };
  }
}
