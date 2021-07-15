import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { UserStatus } from './entities/user-status.entity';

@Injectable()
export class UserStatusesService {
  constructor(@InjectRepository(UserStatus) private readonly userStatusesRepository: Repository<UserStatus>) {}

  async paginate({perPage, offset}: PaginationOptions): Promise<PaginationResult<UserStatus>> {
    const [userStatuses, total] = await this.userStatusesRepository.findAndCount({
      take: perPage,
      skip: offset,
    });

    return new PaginationResult(userStatuses, total, perPage);
  }
}
