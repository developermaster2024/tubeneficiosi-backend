import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FileToBodyInterceptor } from 'src/support/interceptors/file-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { ReadCardDto } from './dto/read-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardPaginationPipe } from './pipes/card-pagination.pipe';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  async paginate(@Query(CardPaginationPipe) options: any): Promise<PaginationResult<ReadCardDto>> {
    return (await this.cardsService.paginate(options)).toClass(ReadCardDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'))
  async create(@Body() createCardDto: CreateCardDto): Promise<ReadCardDto> {
    return plainToClass(ReadCardDto, await this.cardsService.create(createCardDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadCardDto> {
    return plainToClass(ReadCardDto, await this.cardsService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'), new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() updateCardDto: UpdateCardDto): Promise<ReadCardDto> {
    return plainToClass(ReadCardDto, await this.cardsService.update(updateCardDto))
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id') id: string): Promise<void> {
    await this.cardsService.delete(+id);
  }
}
