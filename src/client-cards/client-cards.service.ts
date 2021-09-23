import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToggleClientCardDto } from './dto/toggle-client-card.dto';
import { ClientToCard } from './entities/client-to-card.entity';

@Injectable()
export class ClientCardsService {
  constructor(@InjectRepository(ClientToCard) private readonly clientToCardsRepository: Repository<ClientToCard>) {}

  async toggle({ cardId, userId }: ToggleClientCardDto): Promise<boolean> {
    const clientToCard = await this.clientToCardsRepository.createQueryBuilder('clientToCard')
      .where('clientToCard.cardId = :cardId', { cardId })
      .andWhere('clientToCard.userId = :userId', { userId })
      .getOne();

    let clientHasCard: boolean;

    if (clientToCard) {
      await this.clientToCardsRepository.remove(clientToCard);
      clientHasCard = false;
    } else {
      await this.clientToCardsRepository.save(ClientToCard.create({ cardId, userId }));
      clientHasCard = true;
    }

    return clientHasCard;
  }
}
