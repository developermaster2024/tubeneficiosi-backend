import { CardIssuerType } from "src/card-issuer-types/entities/card-issuer-type.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'card_issuers',
})
export class CardIssuer {
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
    name: 'card_issuer_type_id',
    type: 'int',
  })
  cardIssuerTypeId: number;

  @ManyToOne(() => CardIssuerType, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'card_issuer_type_id'})
  cardIssuerType: CardIssuerType;

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

  static create(data: Partial<CardIssuer>): CardIssuer {
    return Object.assign(new CardIssuer(), data);
  }
}
