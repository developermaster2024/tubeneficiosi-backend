import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { Product } from 'src/products/entities/product.entity';
import { StoreFeature } from 'src/store-features/entities/store-feature.entity';
import { filenameGenerator } from 'src/support/file-uploads';
import { SupportModule } from 'src/support/support.module';
import { User } from 'src/users/entities/user.entity';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, StoreFeature, Product]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/stores',
        filename: filenameGenerator,
      })
    }),
    SupportModule,
  ],
  controllers: [StoresController],
  providers: [StoresService]
})
export class StoresModule {}
