import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailService: MailerService,
    private readonly configService: ConfigService
  ) {}

  async sendForgotPasswordEmail({email, token, fullName}: {email: string, token: string, fullName: string}): Promise<void> {
    await this.mailService.sendMail({
      to: email,
      subject: 'Olvide mi contraseña',
      template: './forgot-password',
      context: {
        frontendUrl: this.configService.get('CLIENT_FRONTEND_URL'),
        fullName,
        email,
        token,
      }
    });
  }
}
