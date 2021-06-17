import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
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

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async paginate(@Query(NotificationPaginationPipe) options: any): Promise<PaginationResult<ReadNotificationDto>> {
    return (await this.notificationService.paginate(options)).toClass(ReadNotificationDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async create(@Body() createNotificationDto: CreateNotificationDto): Promise<ReadNotificationDto> {
    return plainToClass(ReadNotificationDto, await this.notificationService.create(createNotificationDto))
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async findOne(@Param('id') id: string): Promise<ReadNotificationDto> {
    return plainToClass(ReadNotificationDto, await this.notificationService.findOne(+id));
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.notificationService.delete(+id);
  }
}
