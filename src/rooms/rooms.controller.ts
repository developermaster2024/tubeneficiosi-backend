import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { CreateRoomDto } from './dto/create-room.dto';
import { DeleteRoomDto } from './dto/delete-room.dto';
import { ReadRoomDto } from './dto/read-room.dto';
import { RoomPaginationPipe } from './pipes/room-pagination.pipe';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  async paginate(@Query(RoomPaginationPipe) options: any): Promise<PaginationResult<ReadRoomDto>> {
    return (await this.roomsService.paginate(options)).toClass(ReadRoomDto);
  }

  @Post()
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async create(@Body() createRoomDto: CreateRoomDto): Promise<ReadRoomDto> {
    return plainToClass(ReadRoomDto, await this.roomsService.create(createRoomDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadRoomDto> {
    return plainToClass(ReadRoomDto, await this.roomsService.findOne(+id));
  }

  @Delete(':id')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ id: 'id' }))
  async delete(@Body() deleteRoomDto: DeleteRoomDto): Promise<void> {
    await this.roomsService.delete(deleteRoomDto);
  }
}
