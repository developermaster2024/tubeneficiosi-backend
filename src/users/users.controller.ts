import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { CreateUserDto } from './dto/create-user.dto';
import { ReadAdminDto } from './dto/read-admin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './enums/roles.enum';
import { UserPaginationPipe } from './pipes/user-pagination.pipe';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async paginate(@Query(UserPaginationPipe) options: any): Promise<PaginationResult<ReadAdminDto>> {
    return (await this.usersService.paginate(options)).toClass(ReadAdminDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async create(@Body() createUserDto: CreateUserDto): Promise<ReadAdminDto> {
    return plainToClass(ReadAdminDto, await this.usersService.create(createUserDto));
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async findOne(@Param('id') id: string): Promise<ReadAdminDto> {
    return plainToClass(ReadAdminDto, await this.usersService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseInterceptors(new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() updateUserDto: UpdateUserDto): Promise<ReadAdminDto> {
    return plainToClass(ReadAdminDto, await this.usersService.update(updateUserDto));
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async delete(@Param('id') id: string): Promise<void> {
    await this.usersService.delete(+id);
  }
}
