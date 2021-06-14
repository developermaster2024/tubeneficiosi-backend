import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBusinessInfoDto } from './dto/udpate-business-info.dto';
import { UpdateAppSectionDto } from './dto/update-app-section.dto';
import { UpdatePageColorsDto } from './dto/update-page-colors.dto';
import { UpdatePageInfoDto } from './dto/update-page-info.dto';
import { Setting } from './entities/setting.entity';
import { Setting as SettingEnum } from './enums/setting.enum';

@Injectable()
export class SettingsService {
  constructor(@InjectRepository(Setting) private readonly settingsRepository: Repository<Setting>) {}

  async findOne(name: SettingEnum): Promise<Setting> {
    const setting = await this.settingsRepository.findOne({name});

    // Fallback to default values if it does not exist

    return setting;
  }

  async udpatePageInfo(updatePageInfoDto: UpdatePageInfoDto): Promise<Setting> {
    const setting = new Setting();
    setting.name = SettingEnum.PAGE_INFO;
    setting.value = {
      ...updatePageInfoDto,
      logo: updatePageInfoDto.logo.path,
    };

    return await this.settingsRepository.save(setting);
  }

  async updatePageColors(updatePageColors: UpdatePageColorsDto): Promise<Setting> {
    let setting = await this.settingsRepository.findOne({name: SettingEnum.COLORS});

    setting = setting ?? Setting.create({name: SettingEnum.COLORS});

    setting.value = updatePageColors;

    return await this.settingsRepository.save(setting);
  }

  async updateBusinessInfo(updateBusinessInfoDto: UpdateBusinessInfoDto): Promise<Setting> {
    let setting = await this.settingsRepository.findOne({name: SettingEnum.BUSINESS_INFO});

    setting = setting ?? Setting.create({name: SettingEnum.BUSINESS_INFO});

    setting.value = {
      ...updateBusinessInfoDto,
      leftSectionImage: updateBusinessInfoDto.leftSectionImage.path,
      rightSectionImage: updateBusinessInfoDto.rightSectionImage.path,
    };

    return await this.settingsRepository.save(setting);
  }

  async updateAppSection(updateAppSectionDto: UpdateAppSectionDto): Promise<Setting> {
    let setting = await this.settingsRepository.findOne({name: SettingEnum.APP_SECTION});

    setting = setting ?? Setting.create({name: SettingEnum.APP_SECTION});

    setting.value = {
      ...updateAppSectionDto,
      leftSideImage: updateAppSectionDto.leftSideImage.path,
      rightSideImage: updateAppSectionDto.rightSideImage.path,
    };

    return await this.settingsRepository.save(setting);
  }
}
