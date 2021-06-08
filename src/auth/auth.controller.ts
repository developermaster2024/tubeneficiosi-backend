import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { RegisterClientDto } from './dto/register-client.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterStoreResponseDto } from './dto/register-store-response.dto';
import { RegisterStoreDto } from './dto/register-store.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req): Promise<LoginResponseDto> {
    return plainToClass(LoginResponseDto, this.authService.login(req.user));
  }

  @Post('/register')
  async register(@Body() registerUserDto: RegisterClientDto): Promise<RegisterResponseDto> {
    return plainToClass(RegisterResponseDto, await this.authService.register(registerUserDto));
  }

  @Post('/register-store')
  async registerStore(@Body() registerStoreDto: RegisterStoreDto): Promise<RegisterStoreResponseDto> {
    return plainToClass(RegisterStoreResponseDto, await this.authService.registerStore(registerStoreDto));
  }
}
