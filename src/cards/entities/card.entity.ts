import { CardIssuer } from "src/card-issuers/entities/card-issuer.entity";
import { CardType } from "src/card-types/entities/card-type.entity";
import { ClientToCard } from "src/client-cards/entities/client-to-card.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'cards',
})
export class Card {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @Column({
    name: 'img_path',
    type: 'varchar',
  })
  imgPath: string;

  @Column({
    name: 'card_issuer_id',
    type: 'int',
  })
  cardIssuerId: number;

  @ManyToOne(() => CardIssuer, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'card_issuer_id'})
  cardIssuer: CardIssuer;

  @Column({
    name: 'card_type_id',
    type: 'int',
    select: false,
  })
  cardTypeId: number;

  @ManyToOne(() => CardType, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'card_type_id'})
  cardType: CardType;

  @OneToMany(() => ClientToCard, clientToCard => clientToCard.card)
  clientToCards: ClientToCard[];

  @CreateDateColumn({
    name: 'created_at',
    select: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    select: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    select: false
  })
  deletedAt: Date;

  static create(data: Partial<Card>): Card {
    return Object.assign(new Card(), data);
  }
}
