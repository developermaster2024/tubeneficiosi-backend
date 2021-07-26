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
import { CardIssuersService } from './card-issuers.service';
import { CreateCardIssuerDto } from './dto/create-card-issuer.dto';
import { ReadCardIssuerDto } from './dto/read-card-issuer.dto';
import { UpdateCardIssuerDto } from './dto/update-card-issuer.dto';
import { CardIssuerPaginationPipe } from './pipes/card-issuer-pagination.pipe';

@Controller('card-issuers')
export class CardIssuersController {
  constructor(private readonly cardIssuersService: CardIssuersService) {}

  @Get()
  async paginate(@Query(CardIssuerPaginationPipe) options: any): Promise<PaginationResult<ReadCardIssuerDto>> {
    return (await this.cardIssuersService.paginate(options)).toClass(ReadCardIssuerDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'))
  async create(@Body() createCardIssuerDto: CreateCardIssuerDto): Promise<ReadCardIssuerDto> {
    return plainToClass(ReadCardIssuerDto, await this.cardIssuersService.create(createCardIssuerDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadCardIssuerDto> {
    return plainToClass(ReadCardIssuerDto, await this.cardIssuersService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'), new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() updateCardIssuerDto: UpdateCardIssuerDto): Promise<ReadCardIssuerDto> {
    return plainToClass(ReadCardIssuerDto, await this.cardIssuersService.update(updateCardIssuerDto));
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id') id: string): Promise<void> {
    await this.cardIssuersService.delete(+id);
  }
}
