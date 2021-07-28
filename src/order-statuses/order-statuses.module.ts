import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderStatus } from './entities/order-status.entity';
import { OrderStatusesController } from './order-statuses.controller';
import { OrderStatusesService } from './order-statuses.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderStatus])],
  controllers: [OrderStatusesController],
  providers: [OrderStatusesService]
})
export class OrderStatusesModule {}
