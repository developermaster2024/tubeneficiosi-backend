import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientCardsController } from './client-cards.controller';
import { ClientCardsService } from './client-cards.service';
import { ClientToCard } from './entities/client-to-card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientToCard])],
  controllers: [ClientCardsController],
  providers: [ClientCardsService]
})
export class ClientCardsModule {}
