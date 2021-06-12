import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { filenameGenerator } from 'src/support/file-uploads';
import { HelpCategory } from './entities/help-category.entity';
import { HelpCategoriesController } from './help-categories.controller';
import { HelpCategoriesService } from './help-categories.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HelpCategory]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/help-categories',
        filename: filenameGenerator,
      })
    }),
  ],
  controllers: [HelpCategoriesController],
  providers: [HelpCategoriesService]
})
export class HelpCategoriesModule {}
