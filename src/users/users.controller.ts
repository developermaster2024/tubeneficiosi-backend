import { Body, Controller, Post } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<ReadUserDto> {
    return plainToClass(ReadUserDto, await this.usersService.create(createUserDto));
  }
}
