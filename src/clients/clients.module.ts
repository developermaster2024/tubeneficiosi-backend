import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { filenameGenerator } from 'src/support/file-uploads';
import { SupportModule } from 'src/support/support.module';
import { User } from 'src/users/entities/user.entity';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';

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
  controllers: [ClientsController],
  providers: [ClientsService]
})
export class ClientsModule {}
