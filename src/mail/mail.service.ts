import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/users/enums/roles.enum';
import { SendForgotPasswordEmailDto } from './dto/send-forgot-password.dto';

@Injectable()
export class MailService {
  constructor(
    private readonly mailService: MailerService,
    private readonly configService: ConfigService
  ) {}

  async sendForgotPasswordEmail({email, token, fullName, role}: SendForgotPasswordEmailDto): Promise<void> {
    await this.mailService.sendMail({
      to: email,
      subject: 'Recuperar contraseña',
      template: './forgot-password',
      context: {
        frontendUrl: role === Role.CLIENT ? this.configService.get('CLIENT_FRONTEND_URL') : this.configService.get('STORES_FRONTEND_URL'),
        fullName,
        email,
        token,
      }
    });
  }
}
