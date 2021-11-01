import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { Category } from 'src/categories/entities/category.entity';
import { Place } from 'src/places/entities/place.entity';
import { Product } from 'src/products/entities/product.entity';
import { Store } from 'src/stores/entities/store.entity';
import { filenameGenerator } from 'src/support/file-uploads';
import { Tag } from 'src/tags/entities/tag.entity';
import { Show } from './entities/show.entity';
import { ShowsController } from './shows.controller';
import { ShowsService } from './shows.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Store, Show, Place, Tag, Category]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/products',
        filename: filenameGenerator,
      })
    }),
  ],
  controllers: [ShowsController],
  providers: [ShowsService]
})
export class ShowsModule {}
