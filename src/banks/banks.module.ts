import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { filenameGenerator } from 'src/support/file-uploads';
import { BanksController } from './banks.controller';
import { BanksService } from './banks.service';
import { Bank } from './entities/bank.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bank]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/banks',
        filename: filenameGenerator,
      })
    }),
  ],
  controllers: [BanksController],
  providers: [BanksService]
})
export class BanksModule {}
