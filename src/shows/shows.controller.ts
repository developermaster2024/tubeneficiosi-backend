import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { SlugifierInterceptor } from 'src/support/interceptors/slugifier.interceptor';
import { Role } from 'src/users/enums/roles.enum';
import { AddShowDto } from './dto/add-show.dto';
import { CreateProductShowDto } from './dto/create-product-show.dto';
import { DeleteProductShowDto } from './dto/delete-product-show.dto';
import { ReadProductShowDto } from './dto/read-product-show.dto';
import { ReadShowDto } from './dto/read-show.dto';
import { UpdateProductShowDto } from './dto/update-product-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { ShowsService } from './shows.service';

@Controller('shows')
export class ShowsController {
  constructor(private readonly showsService: ShowsService) {}

  @Post()
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor('images'), new JwtUserToBodyInterceptor(), new SlugifierInterceptor({name: 'slug'}))
  async create(
    @Body() createShowDto: CreateProductShowDto,
    @UploadedFiles() images: Express.Multer.File[]
  ): Promise<ReadProductShowDto> {
    return plainToClass(ReadProductShowDto, await this.showsService.create(createShowDto, images));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadProductShowDto> {
    return plainToClass(ReadProductShowDto, await this.showsService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() updateShowDto: UpdateProductShowDto): Promise<ReadProductShowDto> {
    return plainToClass(ReadProductShowDto, await this.showsService.update(updateShowDto));
  }

  @Delete(':id')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ id: 'id' }))
  async delete(@Body() deleteShowDto: DeleteProductShowDto): Promise<void> {
    await this.showsService.delete(deleteShowDto);
  }

  @Post(':id/shows')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ id: 'productId' }))
  async addShow(@Body() addShowDto: AddShowDto): Promise<ReadShowDto> {
    return plainToClass(ReadShowDto, await this.showsService.addShow(addShowDto));
  }

  @Put(':id/shows/:showId')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ id: 'productId', showId: 'showId' }))
  async updateShow(@Body() udpateShowDto: UpdateShowDto): Promise<ReadShowDto> {
    return plainToClass(ReadShowDto, await this.showsService.updateShow(udpateShowDto));
  }
}
