import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OneSignalService } from 'onesignal-api-client-nest';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/roles.enum';
import { UserNotFoundException } from 'src/users/errors/user-not-found.exception';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationPaginationOptionsDto } from './dto/notification-pagination-options.dto';
import { Notification } from './entities/notification.entity';
import { UserToNotification } from './entities/user-to-notification.entity';
import { NotificationNotFoundException } from './errors/notification-not-found.exception';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationByDeviceBuilder } from 'onesignal-api-client-core';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private readonly notificationsRepository: Repository<Notification>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(UserToNotification) private readonly userToNotificationsRepository: Repository<UserToNotification>,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly oneSignalService: OneSignalService,
    private readonly configService: ConfigService
  ) {}

  async paginate({offset, perPage, filters: {
    id,
    from,
    until,
    forUserId,
  }, order}: NotificationPaginationOptionsDto, userId: number): Promise<PaginationResult<Notification>> {
    const user = await this.usersRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    const queryBuilder = this.notificationsRepository.createQueryBuilder('notification')
      .leftJoin('notification.userToNotifications', 'userToNotifications')
      .leftJoinAndMapOne(
        'notification.userToNotification',
        'notification.userToNotifications',
        'userToNotification',
        'userToNotification.user_id = :userId',
        { userId }
      )
      .take(perPage)
      .skip(offset);

    Object.keys(order).forEach(key => queryBuilder.addOrderBy(`notification.${key}`, order[key]));

    if (user.role !== Role.ADMIN) {
      queryBuilder.andWhere('userToNotifications.userId = :userId', { userId });
    } else if (forUserId) {
      queryBuilder.andWhere('userToNotifications.userId = :userId', { userId: forUserId });
    }

    if (id) queryBuilder.andWhere('notification.id = :id', { id });

    if (from) queryBuilder.andWhere('notification.createdAt >= :from', { from });

    if (until) queryBuilder.andWhere('notification.createdAt <= :until', { until });

    const [notifications, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(notifications, total, perPage);
  }

  async create({role, message, ...createNotificationDto}: CreateNotificationDto): Promise<Notification> {
    const users = await this.usersRepository.find({
      select: ['id'],
      where: {role}
    });

    const userToNotifications = users.map(user => UserToNotification.create({user}));

    let notification = Notification.create({
      ...createNotificationDto,
      message,
      userToNotifications,
    });

    notification = await this.notificationsRepository.save(notification);

    this.notificationsGateway.server.emit(role, notification);

    return notification;
  }

  async findOne(id: number, userId: number): Promise<Notification> {
    const user = await this.usersRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    const queryBuilder = this.notificationsRepository.createQueryBuilder('notification')
      .leftJoin('notification.userToNotifications', 'userToNotifications')
      .leftJoinAndMapOne(
        'notification.userToNotification',
        'notification.userToNotifications',
        'userToNotification',
        'userToNotification.user_id = :userId',
        { userId }
      )
      .where('notification.id = :id', { id });

    if (user.role !== Role.ADMIN) {
      queryBuilder.andWhere('userToNotification.userId = :userId', { userId });
    }

    const notification = await queryBuilder.getOne();

    if (!notification) {
      throw new NotificationNotFoundException();
    }

    return notification;
  }

  async delete(id: number): Promise<void> {
    const notification = await this.notificationsRepository.findOne(id);

    if (!notification) {
      throw new NotificationNotFoundException();
    }

    await this.notificationsRepository.softRemove(notification);
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.userToNotificationsRepository.createQueryBuilder('userToNotification')
      .update(UserToNotification)
      .set({ seen: true })
      .where('userId = :userId', { userId })
      .execute();
  }

  async notifyUsersById(userIds: number[], notification: Notification) {
    const input = new NotificationByDeviceBuilder()
      .setIncludeExternalUserIds(userIds.map(id => String(id)))
      .notification()
      .setHeadings({ en: notification.title })
      .setContents({ en: notification.message })
      .setAttachments({ data: notification.toDto() })
      .setAppearance({ large_icon: this.configService.get('ONESIGNAL_LARGE_ICON_URL') })
      .build();

    await this.oneSignalService.createNotification(input);
  }
}
