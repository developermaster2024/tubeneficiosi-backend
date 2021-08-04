import { Body, Controller, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Role } from 'src/users/enums/roles.enum';
import { SlugifierInterceptor } from 'src/support/interceptors/slugifier.interceptor';

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
  @UseInterceptors(new SlugifierInterceptor({name: 'slug'}))
  async registerStore(@Body() registerStoreDto: RegisterStoreDto): Promise<RegisterStoreResponseDto> {
    return plainToClass(RegisterStoreResponseDto, await this.authService.registerStore(registerStoreDto));
  }

  @UseGuards(LocalAuthAdminGuard)
  @Post('/login-admin')
  async loginAdmin(@Request() req): Promise<LoginAdminResponse> {
    return plainToClass(LoginAdminResponse, this.authService.login(req.user));
  }

  @Post('/forgot-client-password')
  async forgotClientPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    await this.authService.forgotPassword(forgotPasswordDto, Role.CLIENT);
  }

  @Post('/reset-client-password')
  async resetClientPassword(@Body() resetClientPasswordDto: ResetPasswordDto): Promise<void> {
    await this.authService.resetPassword(resetClientPasswordDto, Role.CLIENT);
  }

  @Post('/forgot-store-password')
  async forgotStorePassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    await this.authService.forgotPassword(forgotPasswordDto, Role.STORE);
  }

  @Post('/reset-store-password')
  async resetStorePassword(@Body() resetClientPasswordDto: ResetPasswordDto): Promise<void> {
    await this.authService.resetPassword(resetClientPasswordDto, Role.STORE);
  }
}
