import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FileToBodyInterceptor } from 'src/support/interceptors/file-to-body.interceptor';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { CreateNewsDto } from './dto/create-news.dto';
import { DeleteNewsDto } from './dto/delete-news.dto';
import { ReadNewsDto } from './dto/read-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsService } from './news.service';
import { NewsPaginationPipe } from './pipes/news-pagination.pipe';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async paginate(@Query(NewsPaginationPipe) options: any): Promise<PaginationResult<ReadNewsDto>> {
    return (await this.newsService.paginate(options)).toClass(ReadNewsDto);
  }

  @Post()
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'), new JwtUserToBodyInterceptor())
  async create(@Body() createNewsDto: CreateNewsDto): Promise<ReadNewsDto> {
    return plainToClass(ReadNewsDto, await this.newsService.create(createNewsDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadNewsDto> {
    return plainToClass(ReadNewsDto, await this.newsService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'), new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ id: 'id' }))
  async udpate(@Body() updateNewsDto: UpdateNewsDto): Promise<ReadNewsDto> {
    return plainToClass(ReadNewsDto, await this.newsService.update(updateNewsDto));
  }

  @Delete(':id')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ id: 'id' }))
  async delete(@Body() deleteNewsDto: DeleteNewsDto): Promise<void> {
    await this.newsService.delete(deleteNewsDto);
  }
}
