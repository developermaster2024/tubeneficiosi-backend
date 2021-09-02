import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { SupportModule } from 'src/support/support.module';
import { LocalStrategy } from './passport-strategies/local.strategy';
import { JwtStrategy } from './passport-strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { LocalStoreStrategy } from './passport-strategies/local-store.strategy';
import { LocalAdminStrategy } from './passport-strategies/local-admin.strategy';
import { StoreHour } from 'src/store-hours/entities/store-hour.entity';
import { MailModule } from 'src/mail/mail.module';
import { PasswordReset } from './entities/password-reset.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { Notification } from 'src/notifications/entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, StoreHour, PasswordReset, Notification]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {expiresIn: configService.get('JWT_EXPIRATION_TIME')},
      }),
    }),
    UsersModule,
    SupportModule,
    MailModule,
    NotificationsModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, LocalStoreStrategy, LocalAdminStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
