import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { CardIssuer } from 'src/card-issuers/entities/card-issuer.entity';
import { Card } from 'src/cards/entities/card.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { Store } from 'src/stores/entities/store.entity';
import { filenameGenerator } from 'src/support/file-uploads';
import { User } from 'src/users/entities/user.entity';
import { DiscountsController } from './discounts.controller';
import { DiscountsService } from './discounts.service';
import { Discount } from './entities/discount.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Discount, Card, CardIssuer, Store, User, Notification]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/discounts',
        filename: filenameGenerator,
      }),
    }),
    NotificationsModule,
  ],
  controllers: [DiscountsController],
  providers: [DiscountsService]
})
export class DiscountsModule {}
