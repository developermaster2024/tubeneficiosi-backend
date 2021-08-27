import { Module } from '@nestjs/common';
import { DeliveryNotesService } from './delivery-notes.service';
import { DeliveryNotesController } from './delivery-notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryNote } from './entities/delivery-note.entity';
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryNote, Order, User])],
  providers: [DeliveryNotesService],
  controllers: [DeliveryNotesController]
})
export class DeliveryNotesModule {}
