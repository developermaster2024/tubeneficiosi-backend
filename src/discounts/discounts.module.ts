import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { CardIssuer } from 'src/card-issuers/entities/card-issuer.entity';
import { Card } from 'src/cards/entities/card.entity';
import { Store } from 'src/stores/entities/store.entity';
import { filenameGenerator } from 'src/support/file-uploads';
import { DiscountsController } from './discounts.controller';
import { DiscountsService } from './discounts.service';
import { Discount } from './entities/discount.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Discount, Card, CardIssuer, Store]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/discounts',
        filename: filenameGenerator,
      }),
    }),
  ],
  controllers: [DiscountsController],
  providers: [DiscountsService]
})
export class DiscountsModule {}
