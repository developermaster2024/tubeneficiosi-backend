import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { CreateTagDto } from './dto/create-tag.dto';
import { ReadTagDto } from './dto/read-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagPaginationPipe } from './pipes/tag-pagination.pipe';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async paginate(@Query(TagPaginationPipe) options: any): Promise<PaginationResult<ReadTagDto>> {
    return (await this.tagsService.paginate(options)).toClass(ReadTagDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createTagDto: CreateTagDto): Promise<ReadTagDto> {
    return plainToClass(ReadTagDto, await this.tagsService.create(createTagDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadTagDto> {
    return plainToClass(ReadTagDto, await this.tagsService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() updateTagDto: UpdateTagDto): Promise<ReadTagDto> {
    return plainToClass(ReadTagDto, await this.tagsService.udpate(updateTagDto));
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return await this.tagsService.delete(+id);
  }
}
