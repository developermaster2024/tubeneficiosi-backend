import { Controller, Get, Query } from '@nestjs/common';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationPipe } from 'src/support/pagination/pagination-pipe';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { UserStatus } from './entities/user-status.entity';
import { UserStatusesService } from './user-statuses.service';

@Controller('user-statuses')
export class UserStatusesController {
  constructor(private readonly userStatusesService: UserStatusesService) {}

  @Get()
  async paginate(@Query(PaginationPipe) options: PaginationOptions): Promise<PaginationResult<UserStatus>> {
    return this.userStatusesService.paginate(options);
  }
}
