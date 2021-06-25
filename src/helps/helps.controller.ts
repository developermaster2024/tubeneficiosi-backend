import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { CreateHelpDto } from './dto/create-help.dto';
import { ReadHelpDto } from './dto/read-help.dto';
import { UpdateHelpDto } from './dto/update-help.dto';
import { HelpsService } from './helps.service';
import { HelpPaginationPipe } from './pipes/help-pagination.pipe';

@Controller('helps')
export class HelpsController {
  constructor(private readonly helpsService: HelpsService) {}

  @Get()
  async paginate(@Query(HelpPaginationPipe) options: any): Promise<PaginationResult<ReadHelpDto>> {
    return (await this.helpsService.paginate(options)).toClass(ReadHelpDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createHelpDto: CreateHelpDto): Promise<ReadHelpDto> {
    return plainToClass(ReadHelpDto, await this.helpsService.create(createHelpDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadHelpDto> {
    return plainToClass(ReadHelpDto, await this.helpsService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() updateHelpDto: UpdateHelpDto): Promise<ReadHelpDto> {
    return plainToClass(ReadHelpDto, await this.helpsService.update(updateHelpDto));
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id') id: string): Promise<void> {
    await this.helpsService.delete(+id);
  }
}
