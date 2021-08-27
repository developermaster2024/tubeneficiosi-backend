import { Body, Controller, Get, Param, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { DeliveryNotesService } from './delivery-notes.service';
import { CreateDeliveryNoteDto } from './dto/create-delivery-note.dto';
import { ReadDeliveryNoteDto } from './dto/read-delivery-note.dto';
import { DeliveryNotePaginationPipe } from './pipes/delivery-note-pagination.pipe';

@Controller('delivery-notes')
export class DeliveryNotesController {
  constructor(private readonly deliveryNotesService: DeliveryNotesService) {}

  @Get()
  @Roles(Role.ADMIN, Role.STORE, Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async paginate(
    @Query(DeliveryNotePaginationPipe) options: any,
    @Body('userId') userId: number
  ): Promise<PaginationResult<ReadDeliveryNoteDto>> {
    return (await this.deliveryNotesService.paginate(options, userId)).toClass(ReadDeliveryNoteDto);
  }

  @Post()
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async create(@Body() createDeliveryNoteDto: CreateDeliveryNoteDto): Promise<ReadDeliveryNoteDto> {
    return plainToClass(ReadDeliveryNoteDto, await this.deliveryNotesService.create(createDeliveryNoteDto));
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STORE, Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async findOne(
    @Param('id') id: string,
    @Body('userId') userId: number
  ): Promise<ReadDeliveryNoteDto> {
    return plainToClass(ReadDeliveryNoteDto, await this.deliveryNotesService.findOne(+id, userId));
  }
}
