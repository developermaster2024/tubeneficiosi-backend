import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ValidationModule } from './validation/validation.module';
import { SupportModule } from './support/support.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ValidationModule,
    SupportModule,
    AuthModule,
  ],
})
export class AppModule {}
