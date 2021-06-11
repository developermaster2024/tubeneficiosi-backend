import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get<number>('DATABASE_PORT'),
        database: configService.get('DATABASE_NAME'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        synchronize: configService.get('DATABASE_SYNCRONIZE') === 'true',
        logging: configService.get('DATABASE_LOGGING') === 'true',
        entities: ['dist/**/*.entity{.ts,.js}'],
        legacySpatialSupport: false
      })
    })
  ],
})
export class DatabaseModule {}
