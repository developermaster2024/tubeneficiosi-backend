import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Category } from 'src/categories/entities/category.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { filenameGenerator } from 'src/support/file-uploads';
import { Store } from 'src/stores/entities/store.entity';
import { ProductFeature } from 'src/product-features/entities/product-feature.entity';
import { ProductFeatureGroup } from './entities/product-feature-group.entity';
import { ProductImage } from './entities/product-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductFeature,
      ProductFeatureGroup,
      ProductImage,
      Tag,
      Category,
      Store,
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/products',
        filename: filenameGenerator,
      })
    }),
  ],
  providers: [ProductsService],
  controllers: [ProductsController]
})
export class ProductsModule {}
