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
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { ReadClientDto } from './dto/read-client.dto';
import { UpdateClientPasswordDto } from './dto/update-client-password.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientPaginationPipe } from './pipes/client-pagination.pipe';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.STORE)
  @UseGuards(RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async paginate(
    @Query(ClientPaginationPipe) options: any,
    @Body('userId') userId: number
  ): Promise<PaginationResult<ReadClientDto>> {
    return (await this.clientsService.paginate(options, userId)).toClass(ReadClientDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'))
  async create(@Body() createClientDto: CreateClientDto): Promise<ReadClientDto> {
    return plainToClass(ReadClientDto, await this.clientsService.create(createClientDto));
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async findOne(@Param('id') id: string): Promise<ReadClientDto> {
    return plainToClass(ReadClientDto, await this.clientsService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'), new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() updateClientDto: UpdateClientDto): Promise<ReadClientDto> {
    return plainToClass(ReadClientDto, await this.clientsService.update(updateClientDto));
  }

  @Put(':id/password')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseInterceptors(new ParamsToBodyInterceptor({id: 'id'}))
  async updatePassword(@Body() updateClientPasswordDto: UpdateClientPasswordDto): Promise<ReadClientDto> {
    return plainToClass(ReadClientDto, await this.clientsService.updatePassword(updateClientPasswordDto));
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async delete(@Param('id') id: string): Promise<void> {
    await this.clientsService.delete(+id);
  }
}
