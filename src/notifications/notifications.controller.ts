import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/users/enums/roles.enum';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ReadNotificationDto } from './dto/read-notification.dto';
import { NotificationsService } from './notifications.service';
import { plainToClass } from 'class-transformer';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { NotificationPaginationPipe } from './pipes/notification-pagination.pipe';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.STORE, Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async paginate(
    @Query(NotificationPaginationPipe) options: any,
    @Body('userId') userId: number
  ): Promise<PaginationResult<ReadNotificationDto>> {
    return (await this.notificationService.paginate(options, userId)).toClass(ReadNotificationDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createNotificationDto: CreateNotificationDto): Promise<ReadNotificationDto> {
    return plainToClass(ReadNotificationDto, await this.notificationService.create(createNotificationDto))
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STORE, Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async findOne(
    @Param('id') id: string,
    @Body('userId') userId: number
  ): Promise<ReadNotificationDto> {
    return plainToClass(ReadNotificationDto, await this.notificationService.findOne(+id, userId));
  }

  @Delete(':id(\\d+)')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.notificationService.delete(+id);
  }

  @Delete('mark-all-as-seen')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async markAllAsSeen(@Body('userId') userId: number): Promise<void> {
    await this.notificationService.markAllAsRead(userId);
  }
}
