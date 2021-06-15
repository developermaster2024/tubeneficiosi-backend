import { Body, Controller, Get, Param, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FileToBodyInterceptor } from 'src/support/interceptors/file-to-body.interceptor';
import { FilesToBodyInterceptor } from 'src/support/interceptors/files-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { Role } from 'src/users/enums/roles.enum';
import { ReadAppSectionDto } from './dto/read-app-section.dto';
import { ReadBusinessInfoDto } from './dto/read-business-info.dto';
import { ReadFooterDto } from './dto/read-footer.dto';
import { ReadNeededInfoDto } from './dto/read-needed-info.dto';
import { ReadPageColorsDto } from './dto/read-page-colors.dto';
import { ReadPageInfoDto } from './dto/read-page-info.dto';
import { UpdateBusinessInfoDto } from './dto/udpate-business-info.dto';
import { UpdateAppSectionDto } from './dto/update-app-section.dto';
import { UpdateFooterSectionDto } from './dto/update-footer-section.dto';
import { UpdateNeededInfoDto } from './dto/update-needed-info.dto';
import { UpdatePageColorsDto } from './dto/update-page-colors.dto';
import { UpdatePageInfoDto } from './dto/update-page-info.dto';
import { Setting } from './enums/setting.enum';
import { SettingsService } from './settings.service';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('page-info')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async findPageInfo(): Promise<ReadPageInfoDto> {
    return plainToClass(ReadPageInfoDto, await this.settingsService.findOne(Setting.PAGE_INFO));
  }

  @Put('page-info')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('logo', {dest: 'uploads/settings/'}), new FileToBodyInterceptor('logo'))
  async udpatePageInfo(@Body() updatePageInfoDto: UpdatePageInfoDto): Promise<ReadPageInfoDto> {
    return plainToClass(ReadPageInfoDto, await this.settingsService.udpatePageInfo(updatePageInfoDto));
  }

  @Get('colors')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async findPageColors(): Promise<ReadPageColorsDto> {
    return plainToClass(ReadPageColorsDto, await this.settingsService.findOne(Setting.COLORS));
  }

  @Put('colors')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async updatePageColors(@Body() updatePageColors: UpdatePageColorsDto): Promise<ReadPageColorsDto> {
    return plainToClass(ReadPageColorsDto, await this.settingsService.updatePageColors(updatePageColors));
  }

  @Get('business-info')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async findBusinessInfo(): Promise<ReadBusinessInfoDto> {
    return plainToClass(ReadBusinessInfoDto, await this.settingsService.findOne(Setting.BUSINESS_INFO));
  }

  @Put('business-info')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'leftSectionImage', maxCount: 1 }, { name: 'rightSectionImage', maxCount: 1 }], {dest: '/uploads/settings/'}),
    new FilesToBodyInterceptor(['leftSectionImage', 'rightSectionImage'])
  )
  async updateBusinessInfo(@Body() updateBusinessInfoDto: UpdateBusinessInfoDto): Promise<ReadBusinessInfoDto> {
    return plainToClass(ReadBusinessInfoDto, await this.settingsService.updateBusinessInfo(updateBusinessInfoDto));
  }

  @Get('app-section')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async findAppSection(): Promise<ReadAppSectionDto> {
    return plainToClass(ReadAppSectionDto, await this.settingsService.findOne(Setting.APP_SECTION));
  }

  @Put('app-section')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'leftSideImage', maxCount: 1 }, { name: 'rightSideImage', maxCount: 1 }], {dest: '/uploads/settings/'}),
    new FilesToBodyInterceptor(['leftSideImage', 'rightSideImage'])
  )
  async updateAppSection(@Body() updateAppSectionDto: UpdateAppSectionDto): Promise<ReadAppSectionDto> {
    return plainToClass(ReadAppSectionDto, await this.settingsService.updateAppSection(updateAppSectionDto));
  }

  @Get('needed-info')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async findNeededInfo(): Promise<ReadNeededInfoDto> {
    return plainToClass(ReadNeededInfoDto, await this.settingsService.findOne(Setting.NEEDED_INFO));
  }

  @Put('needed-info')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'leftSectionImage', maxCount: 1 },
      { name: 'middleSectionImage', maxCount: 1 },
      { name: 'rightSectionImage', maxCount: 1 }
    ], {dest: '/uploads/settings/'}),
    new FilesToBodyInterceptor(['leftSectionImage', 'middleSectionImage', 'rightSectionImage'])
  )
  async updateNeededInfo(@Body() updateNeededInfoDto: UpdateNeededInfoDto): Promise<ReadNeededInfoDto> {
    return plainToClass(ReadNeededInfoDto, await this.settingsService.updateNeededInfo(updateNeededInfoDto));
  }

  @Put('footer-sections/:id([1-4])')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseInterceptors(FilesInterceptor('images'), new ParamsToBodyInterceptor({id: 'id'}))
  async updateFooterSection(
    @Body() updateFooterSectionDto: UpdateFooterSectionDto,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<ReadFooterDto> {
    return plainToClass(ReadFooterDto, await this.settingsService.updateFooterSection(updateFooterSectionDto, files));
  }

  @Put('footer-sections/:id([1-4])/toggle-active-state')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async toggeFooterSection(@Param('id') id: string): Promise<ReadFooterDto> {
    return plainToClass(ReadFooterDto, await this.settingsService.toggeFooterSection(id));
  }
}
