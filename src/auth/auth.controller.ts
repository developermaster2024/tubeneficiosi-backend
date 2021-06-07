import { Body, Controller, Header, Post, Request, UseGuards } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @Header('Content-Type', 'application/json')
  @Header('Accept', 'application/json')
  async login(@Request() req): Promise<LoginResponseDto> {
    return plainToClass(LoginResponseDto, this.authService.login(req.user));
  }

  @Post('/register')
  @Header('Content-Type', 'application/json')
  @Header('Accept', 'application/json')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<RegisterResponseDto> {
    return plainToClass(RegisterResponseDto, await this.authService.register(registerUserDto));
  }
}
