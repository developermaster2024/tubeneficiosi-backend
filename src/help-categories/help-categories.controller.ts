import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FileToBodyInterceptor } from 'src/support/interceptors/file-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { CreateHelpCategoryDto } from './dto/create-help-category.dto';
import { ReadHelpCategoryDto } from './dto/read-help-category.dto';
import { UpdateHelpCategoryDto } from './dto/update-help-category.dto';
import { HelpCategoriesService } from './help-categories.service';
import { HelpCategoryPaginationPipe } from './pipes/help-category-pagination.pipe';

@Controller('help-categories')
export class HelpCategoriesController {
  constructor(private readonly helpCategoriesService: HelpCategoriesService) {}

  @Get()
  async paginate(@Query(HelpCategoryPaginationPipe) options: any): Promise<PaginationResult<ReadHelpCategoryDto>> {
    return (await this.helpCategoriesService.paginate(options)).toClass(ReadHelpCategoryDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('icon', {dest: 'uploads/help-categories/'}), new FileToBodyInterceptor('icon'))
  async create(
    @Body() createHelpCategoryDto: CreateHelpCategoryDto
  ): Promise<ReadHelpCategoryDto> {
    return plainToClass(ReadHelpCategoryDto, await this.helpCategoriesService.create(createHelpCategoryDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadHelpCategoryDto> {
    return plainToClass(ReadHelpCategoryDto, await this.helpCategoriesService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('icon', {dest: 'uploads/help-categories/'}),
    new FileToBodyInterceptor('icon'),
    new ParamsToBodyInterceptor({id: 'id'})
  )
  async update(@Body() updateHelpCategoryDto: UpdateHelpCategoryDto): Promise<ReadHelpCategoryDto> {
    return plainToClass(ReadHelpCategoryDto, await this.helpCategoriesService.update(updateHelpCategoryDto));
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.helpCategoriesService.delete(+id);
  }
}
