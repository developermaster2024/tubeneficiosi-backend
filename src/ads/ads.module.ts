import { Module } from '@nestjs/common';
import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { filenameGenerator } from 'src/support/file-uploads';
import { Ad } from './entities/ad.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ad]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/users',
        filename: filenameGenerator,
      })
    }),
  ],
  providers: [AdsService],
  controllers: [AdsController]
})
export class AdsModule {}
