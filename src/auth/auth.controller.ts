import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { RegisterClientDto } from './dto/register-client.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterStoreResponseDto } from './dto/register-store-response.dto';
import { RegisterStoreDto } from './dto/register-store.dto';
import { LoginStoreResponseDto } from './dto/login-store-response.dto';
import { LocalAuthStoreGuard } from './guards/local-auth-store.guard';
import { LoginAdminResponse } from './dto/login-admin-response.dto';
import { LocalAuthAdminGuard } from './guards/local-auth-admin.guard';
import { ForgotClientPasswordDto } from './dto/forgot-client-password.dto';
import { ResetClientPasswordDto } from './dto/reset-client-password.dto';

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

  @UseGuards(LocalAuthStoreGuard)
  @Post('/login-store')
  async loginStore(@Request() req): Promise<LoginStoreResponseDto> {
    return plainToClass(LoginStoreResponseDto, this.authService.login(req.user));
  }

  @Post('/register-store')
  async registerStore(@Body() registerStoreDto: RegisterStoreDto): Promise<RegisterStoreResponseDto> {
    return plainToClass(RegisterStoreResponseDto, await this.authService.registerStore(registerStoreDto));
  }

  @UseGuards(LocalAuthAdminGuard)
  @Post('/login-admin')
  async loginAdmin(@Request() req): Promise<LoginAdminResponse> {
    return plainToClass(LoginAdminResponse, this.authService.login(req.user));
  }

  @Post('/forgot-client-password')
  async forgotClientPassword(@Body() forgotPasswordDto: ForgotClientPasswordDto): Promise<any> {
    await this.authService.forgotClientPassword(forgotPasswordDto);
  }

  @Post('/reset-client-password')
  async resetClientPassword(@Body() resetClientPasswordDto: ResetClientPasswordDto): Promise<any> {
    await this.authService.resetClientPassword(resetClientPasswordDto);
  }
}
