import { Body, Controller, Get, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FileToBodyInterceptor } from 'src/support/interceptors/file-to-body.interceptor';
import { Role } from 'src/users/enums/roles.enum';
import { ReadPageInfoDto } from './dto/read-page-info.dto';
import { UpdatePageInfoDto } from './dto/update-page-info.dto';
import { SettingsService } from './settings.service';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('page-info')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async findPageInfo(): Promise<ReadPageInfoDto> {
    return plainToClass(ReadPageInfoDto, await this.settingsService.findPageInfo());
  }

  @Put('page-info')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('logo', {dest: 'uploads/settings/'}), new FileToBodyInterceptor('logo'))
  async udpatePageInfo(@Body() updatePageInfoDto: UpdatePageInfoDto): Promise<ReadPageInfoDto> {
    return plainToClass(ReadPageInfoDto, await this.settingsService.udpatePageInfo(updatePageInfoDto));
  }
}
