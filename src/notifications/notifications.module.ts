import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { User } from 'src/users/entities/user.entity';
import { NotificationsGateway } from './notifications.gateway';
import { UserToNotification } from './entities/user-to-notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User, UserToNotification])],
  providers: [NotificationsService, NotificationsGateway],
  controllers: [NotificationsController],
  exports: [NotificationsGateway],
})
export class NotificationsModule {}
