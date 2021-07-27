import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationPipe } from 'src/support/pagination/pagination-pipe';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { CardTypesService } from './card-types.service';
import { CreateCardTypeDto } from './dto/create-card-type.dto';
import { ReadCardTypeDto } from './dto/read-card-type.dto';
import { UpdateCardTypeDto } from './dto/update-card-type.dto';

@Controller('card-types')
export class CardTypesController {
  constructor(private readonly cardTypesService: CardTypesService) {}

  @Get()
  async paginate(@Query(PaginationPipe) options: any): Promise<PaginationResult<ReadCardTypeDto>> {
    return (await this.cardTypesService.paginate(options)).toClass(ReadCardTypeDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createCardTypeDto: CreateCardTypeDto): Promise<ReadCardTypeDto> {
    return plainToClass(ReadCardTypeDto, await this.cardTypesService.create(createCardTypeDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadCardTypeDto> {
    return plainToClass(ReadCardTypeDto, await this.cardTypesService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() updateCardTypeDto: UpdateCardTypeDto): Promise<ReadCardTypeDto> {
    return plainToClass(ReadCardTypeDto, await this.cardTypesService.update(updateCardTypeDto));
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id') id: string): Promise<void> {
    await this.cardTypesService.delete(+id);
  }
}
