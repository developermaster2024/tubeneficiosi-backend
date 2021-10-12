import { Module } from '@nestjs/common';
import { StoresProfileService } from './stores-profile.service';
import { StoresProfileController } from './stores-profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { filenameGenerator } from 'src/support/file-uploads';
import { SupportModule } from 'src/support/support.module';
import { StoreFeature } from 'src/store-features/entities/store-feature.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, StoreFeature]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/stores',
        filename: filenameGenerator,
      })
    }),
    SupportModule,
  ],
  providers: [StoresProfileService],
  controllers: [StoresProfileController]
})
export class StoresProfileModule {}
