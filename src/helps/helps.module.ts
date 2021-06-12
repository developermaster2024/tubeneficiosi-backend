import { Module } from '@nestjs/common';
import { HelpsService } from './helps.service';
import { HelpsController } from './helps.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Help } from './entities/help.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Help])],
  providers: [HelpsService],
  controllers: [HelpsController]
})
export class HelpsModule {}
