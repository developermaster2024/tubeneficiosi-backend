import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationPaginationOptionsDto } from './dto/notification-pagination-options.dto';
import { Notification } from './entities/notification.entity';
import { UserToNotification } from './entities/user-to-notification.entity';
import { NotificationNotFoundException } from './errors/notification-not-found.exception';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private readonly notificationsRepository: Repository<Notification>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly notificationsGateway: NotificationsGateway
  ) {}

  async paginate({offset, perPage, filters}: NotificationPaginationOptionsDto): Promise<PaginationResult<Notification>> {
    const queryBuilder = this.notificationsRepository.createQueryBuilder('notification')
      .take(perPage)
      .skip(offset);

    if (filters.id) queryBuilder.andWhere('notification.id = :id', {id: filters.id});

    if (filters.from) queryBuilder.andWhere('notification.createdAt >= :from', {from: filters.from});

    if (filters.until) queryBuilder.andWhere('notification.createdAt <= :until', {until: filters.until});

    const [notifications, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(notifications, total, perPage);
  }

  async create({role, message}: CreateNotificationDto): Promise<Notification> {
    const users = await this.usersRepository.find({
      select: ['id'],
      where: {role}
    });

    const userToNotifications = users.map(user => UserToNotification.create({user}));

    let notification = Notification.create({
      message,
      role,
      userToNotifications,
    });

    notification = await this.notificationsRepository.save(notification);

    this.notificationsGateway.server.emit(role, notification);

    return notification;
  }

  async findOne(id: number): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne(id);

    if (!notification) {
      throw new NotificationNotFoundException();
    }

    return notification;
  }

  async delete(id: number): Promise<void> {
    const notification = await this.findOne(id);

    await this.notificationsRepository.softRemove(notification);
  }
}
