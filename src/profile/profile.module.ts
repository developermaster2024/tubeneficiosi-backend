import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { filenameGenerator } from 'src/support/file-uploads';
import { SupportModule } from 'src/support/support.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/users',
        filename: filenameGenerator,
      })
    }),
    SupportModule,
  ],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
