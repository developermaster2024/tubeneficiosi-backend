import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { filenameGenerator } from 'src/support/file-uploads';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/cards',
        filename: filenameGenerator,
      })
    }),
  ],
  providers: [CardsService],
  controllers: [CardsController]
})
export class CardsModule {}
