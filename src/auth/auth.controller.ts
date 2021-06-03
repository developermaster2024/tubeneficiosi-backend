import { Controller, Header, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @Header('Content-Type', 'application/json')
  @Header('Accept', 'application/json')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
