import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationPipe } from 'src/support/pagination/pagination-pipe';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { CardIssuerTypesService } from './card-issuer-types.service';
import { CreateCardIssuerTypeDto } from './dto/create-card-issuer-type.dto';
import { ReadCardIssuerTypeDto } from './dto/read-card-issuer-type.dto';
import { UpdateCardIssuerTypeDto } from './dto/update-card-issuer-type.dto';

@Controller('card-issuer-types')
export class CardIssuerTypesController {
  constructor(private readonly cardIssuerTypesService: CardIssuerTypesService) {}

  @Get()
  async paginate(@Query(PaginationPipe) options: PaginationOptions): Promise<PaginationResult<ReadCardIssuerTypeDto>> {
    return (await this.cardIssuerTypesService.paginate(options)).toClass(ReadCardIssuerTypeDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createCardIssuerTypeDto: CreateCardIssuerTypeDto): Promise<ReadCardIssuerTypeDto> {
    return plainToClass(ReadCardIssuerTypeDto, await this.cardIssuerTypesService.create(createCardIssuerTypeDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadCardIssuerTypeDto> {
    return plainToClass(ReadCardIssuerTypeDto, await this.cardIssuerTypesService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async udpate(@Body() updateCardIssuerTypeDto: UpdateCardIssuerTypeDto): Promise<ReadCardIssuerTypeDto> {
    return plainToClass(ReadCardIssuerTypeDto, await this.cardIssuerTypesService.update(updateCardIssuerTypeDto));
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id') id: string): Promise<void> {
    await this.cardIssuerTypesService.delete(+id);
  }
}
