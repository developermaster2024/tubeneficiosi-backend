import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { filenameGenerator } from 'src/support/file-uploads';
import { Setting } from './entities/setting.entity';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Setting]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/settings',
        filename: filenameGenerator,
      })
    }),
  ],
  controllers: [SettingsController],
  providers: [SettingsService]
})
export class SettingsModule {}
