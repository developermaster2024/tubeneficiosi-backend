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
import { CreateShowDto } from './dto/create-show.dto';
import { DeleteShowDto } from './dto/delete-show.dto';
import { ReadShowDto } from './dto/read-show.dto';
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
    @Body() createShowDto: CreateShowDto,
    @UploadedFiles() images: Express.Multer.File[]
  ): Promise<ReadShowDto> {
    return plainToClass(ReadShowDto, await this.showsService.create(createShowDto, images));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadShowDto> {
    return plainToClass(ReadShowDto, await this.showsService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() updateShowDto: UpdateShowDto): Promise<ReadShowDto> {
    return plainToClass(ReadShowDto, await this.showsService.update(updateShowDto));
  }

  @Delete(':id')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ id: 'id' }))
  async delete(@Body() deleteShowDto: DeleteShowDto): Promise<void> {
    await this.showsService.delete(deleteShowDto);
  }
}
