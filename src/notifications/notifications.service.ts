import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { User } from 'src/users/entities/user.entity';
import { FindConditions, Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationPaginationOptionsDto } from './dto/notification-pagination-options.dto';
import { Notification } from './entities/notification.entity';
import { UserToNotification } from './entities/user-to-notification.entity';
import { NotificationNotFoundException } from './errors/notification-not-found.exception';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private readonly notificationsRepository: Repository<Notification>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>
  ) {}

  async paginate({offset, perPage, filters}: NotificationPaginationOptionsDto): Promise<PaginationResult<Notification>> {
    const where: FindConditions<Notification> = {};

    // @ts-ignore
    if (filters.id) where.id = +filters.id;

    const [notifications, total] = await this.notificationsRepository.findAndCount({
      take: perPage,
      skip: offset,
      where,
    });

    return new PaginationResult(notifications, total, perPage);
  }

  async create({role, message}: CreateNotificationDto): Promise<Notification> {
    const users = await this.usersRepository.find({
      select: ['id'],
      where: {role}
    });

    const userToNotifications = users.map(user => UserToNotification.create({user}));

    const notification = Notification.create({
      userToNotifications,
      message
    });

    return await this.notificationsRepository.save(notification);
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
