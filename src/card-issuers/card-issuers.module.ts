import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { filenameGenerator } from 'src/support/file-uploads';
import { CardIssuersController } from './card-issuers.controller';
import { CardIssuersService } from './card-issuers.service';
import { CardIssuer } from './entities/card-issuer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CardIssuer]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/card-issuers',
        filename: filenameGenerator,
      })
    }),
  ],
  controllers: [CardIssuersController],
  providers: [CardIssuersService]
})
export class CardIssuersModule {}
