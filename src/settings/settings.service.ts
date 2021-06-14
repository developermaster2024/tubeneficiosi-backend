import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePageInfoDto } from './dto/update-page-info.dto';
import { Setting } from './entities/setting.entity';
import { Setting as SettingEnum } from './enums/setting.enum';

@Injectable()
export class SettingsService {
  constructor(@InjectRepository(Setting) private readonly settingsRepository: Repository<Setting>) {}

  async findPageInfo(): Promise<Setting> {
    const setting = await this.settingsRepository.findOne({name: SettingEnum.PAGE_INFO});

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
}
