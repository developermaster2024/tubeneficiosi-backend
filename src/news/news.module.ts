import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { Store } from 'src/stores/entities/store.entity';
import { filenameGenerator } from 'src/support/file-uploads';
import { News } from './entities/news.entity';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([News, Store]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/news',
        filename: filenameGenerator,
      })
    }),
  ],
  controllers: [NewsController],
  providers: [NewsService]
})
export class NewsModule {}
