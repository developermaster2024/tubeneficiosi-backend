import { Module } from '@nestjs/common';
import { UserStatusesService } from './user-statuses.service';
import { UserStatusesController } from './user-statuses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStatus } from './entities/user-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserStatus])],
  providers: [UserStatusesService],
  controllers: [UserStatusesController]
})
export class UserStatusesModule {}
