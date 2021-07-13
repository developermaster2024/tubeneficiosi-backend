import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreHour } from './entities/store-hour.entity';
import { StoreHoursController } from './store-hours.controller';
import { StoreHoursService } from './store-hours.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoreHour])],
  controllers: [StoreHoursController],
  providers: [StoreHoursService]
})
export class StoreHoursModule {}
