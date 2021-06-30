import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBusinessInfoDto } from './dto/udpate-business-info.dto';
import { UpdateAppSectionDto } from './dto/update-app-section.dto';
import { UpdateFooterSectionDto } from './dto/update-footer-section.dto';
import { UpdateNeededInfoDto } from './dto/update-needed-info.dto';
import { UpdatePageColorsDto } from './dto/update-page-colors.dto';
import { UpdatePageInfoDto } from './dto/update-page-info.dto';
import { Setting } from './entities/setting.entity';
import { Setting as SettingEnum } from './enums/setting.enum';

const getFooterSectioName = (id: string) => {
  switch(id) {
    case '1':
      return 'firstSection';
    case '2':
      return 'secondSection';
    case '3':
      return 'thirdSection';
    case '4':
      return 'fourthSection';
    default:
      throw new HttpException(`Invalid footer section id <${id}>`, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

@Injectable()
export class SettingsService {
  constructor(@InjectRepository(Setting) private readonly settingsRepository: Repository<Setting>) {}

  async findOne(name: SettingEnum): Promise<Setting> {
    const setting = await this.settingsRepository.findOne({name});

    // Fallback to default values if it does not exist

    return setting;
  }

  async udpatePageInfo({logo, ...updatePageInfoDto}: UpdatePageInfoDto): Promise<Setting> {
    let setting = await this.settingsRepository.findOne({name: SettingEnum.PAGE_INFO});

    setting = setting ?? Setting.create({name: SettingEnum.COLORS});

    setting.value = {
      ...setting.value,
      ...updatePageInfoDto,
    };

    if (logo) {
      setting.value = {...setting.value, logo: logo.path};
    }

    return await this.settingsRepository.save(setting);
  }

  async updatePageColors(updatePageColors: UpdatePageColorsDto): Promise<Setting> {
    let setting = await this.settingsRepository.findOne({name: SettingEnum.COLORS});

    setting = setting ?? Setting.create({name: SettingEnum.COLORS});

    setting.value = updatePageColors;

    return await this.settingsRepository.save(setting);
  }

  async updateBusinessInfo({leftSectionImage, rightSectionImage, ...updateBusinessInfoDto}: UpdateBusinessInfoDto): Promise<Setting> {
    let setting = await this.settingsRepository.findOne({name: SettingEnum.BUSINESS_INFO});

    setting = setting ?? Setting.create({name: SettingEnum.BUSINESS_INFO});

    setting.value = {
      ...setting.value,
      ...updateBusinessInfoDto,
    };

    if (leftSectionImage) setting.value = {...setting.value, leftSectionImage: leftSectionImage.path};

    if (rightSectionImage) setting.value = {...setting.value, rightSectionImage: rightSectionImage.path};

    return await this.settingsRepository.save(setting);
  }

  async updateAppSection({leftSideImage, rightSideImage, ...updateAppSectionDto}: UpdateAppSectionDto): Promise<Setting> {
    let setting = await this.settingsRepository.findOne({name: SettingEnum.APP_SECTION});

    setting = setting ?? Setting.create({name: SettingEnum.APP_SECTION});

    setting.value = {
      ...setting.value,
      ...updateAppSectionDto,
    };

    if (leftSideImage) setting.value = {...setting.value, leftSideImage: leftSideImage.path};

    if (rightSideImage) setting.value = {...setting.value, rightSideImage: rightSideImage.path};

    return await this.settingsRepository.save(setting);
  }

  async updateNeededInfo({leftSectionImage, middleSectionImage, rightSectionImage, ...updateNeededInfoDto}: UpdateNeededInfoDto): Promise<Setting> {
    let setting = await this.settingsRepository.findOne({name: SettingEnum.NEEDED_INFO});

    setting = setting ?? Setting.create({name: SettingEnum.NEEDED_INFO});

    setting.value = {
      ...setting.value,
      ...updateNeededInfoDto,
    };

    if (leftSectionImage) setting.value = {...setting.value, leftSectionImage: leftSectionImage.path};

    if (middleSectionImage) setting.value = {...setting.value, middleSectionImage: middleSectionImage.path};

    if (rightSectionImage) setting.value = {...setting.value, rightSectionImage: rightSectionImage.path};

    return await this.settingsRepository.save(setting);
  }

  async updateFooterSection({id, widgets, ...updateFooterSectionDto}: UpdateFooterSectionDto, files: Express.Multer.File[]): Promise<Setting> {
    let setting = await this.settingsRepository.findOne({name: SettingEnum.FOOTER});

    setting = setting ?? Setting.create({name: SettingEnum.FOOTER});

    const mappedWidgets = widgets.map(widget => widget.type === 'image'
      ? {...widget, image: files?.splice(0, 1)?.[0]?.path}
      : widget
    );

    const sectionName = getFooterSectioName(id);

    setting.value = {
      ...setting.value,
      [sectionName]: {
        ...updateFooterSectionDto,
        widgets: mappedWidgets,
      },
    };

    return await this.settingsRepository.save(setting);
  }

  async toggeFooterSection(id: string): Promise<Setting> {
    let setting = await this.settingsRepository.findOne({name: SettingEnum.FOOTER});

    setting = setting ?? Setting.create({name: SettingEnum.FOOTER});

    const sectionName = getFooterSectioName(id);

    const footerSection = setting.value[sectionName];

    setting.value = {
      ...setting.value,
      [sectionName]: {
        ...footerSection,
        isActive: !footerSection.isActive
      },
    };

    return await this.settingsRepository.save(setting);
  }
}
