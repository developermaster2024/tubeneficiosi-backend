import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderStatusToOrderStatus } from './entities/order-status-to-order-status.entity';
import { OrderStatus } from './entities/order-status.entity';
import { OrderStatusesController } from './order-statuses.controller';
import { OrderStatusesService } from './order-statuses.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderStatus, OrderStatusToOrderStatus])],
  controllers: [OrderStatusesController],
  providers: [OrderStatusesService]
})
export class OrderStatusesModule {}
