import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private readonly notificationsRepository: Repository<Notification>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly notificationsGateway: NotificationsGateway
  ) {}

  async paginate({offset, perPage, filters: {
    id,
    from,
    until,
  }}: NotificationPaginationOptionsDto, userId: number): Promise<PaginationResult<Notification>> {
    const user = await this.usersRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    const queryBuilder = this.notificationsRepository.createQueryBuilder('notification')
      .leftJoin('notification.userToNotifications', 'userToNotification')
      .take(perPage)
      .skip(offset);

    if (user.role !== Role.ADMIN) {
      queryBuilder.andWhere('userToNotification.userId = :userId', { userId });
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
      .leftJoin('notification.userToNotifications', 'userToNotification')
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
}
