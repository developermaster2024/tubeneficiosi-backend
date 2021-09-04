import { CardIssuer } from "src/card-issuers/entities/card-issuer.entity";
import { Card } from "src/cards/entities/card.entity";
import { DiscountType } from "src/discount-types/entities/discount-type.entity";
import { DiscountTypes } from "src/discount-types/enums/discount-types.enum";
import { Store } from "src/stores/entities/store.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'discounts',
})
export class Discount {
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
    name: 'description',
    type: 'varchar',
  })
  description: string;

  @Column({
    name: 'value',
    type: 'int',
  })
  value: number;

  @Column({
    name: 'from',
    type: 'datetime',
  })
  from: Date;

  @Column({
    name: 'until',
    type: 'datetime',
  })
  until: Date;

  @Column({
    name: 'img_path',
    type: 'varchar',
  })
  imgPath: string;

  @Column({
    name: 'discount_type_code',
    type: 'int',
    select: false,
  })
  discountTypeCode: DiscountTypes;

  @ManyToOne(() => DiscountType, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'discount_type_code' })
  discountType: DiscountType;

  @Column({
    name: 'store_id',
    type: 'int',
    select: false,
  })
  storeId: number;

  @ManyToOne(() => Store, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @ManyToMany(() => Card, { nullable: false, onDelete: 'CASCADE', cascade: ['insert', 'update'] })
  @JoinTable({
    name: 'discount_to_card',
    joinColumn: { name: 'discount_id' },
    inverseJoinColumn: { name: 'card_id' },
  })
  cards: Card[];

  @ManyToMany(() => CardIssuer, { nullable: false, onDelete: 'CASCADE', cascade: ['insert', 'update'] })
  @JoinTable({
    name: 'discount_to_card_issuer',
    joinColumn: { name: 'discount_id' },
    inverseJoinColumn: { name: 'card_issuer_id' }
  })
  cardIssuers: CardIssuer[];

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

  static create(data: Partial<Discount>): Discount {
    return Object.assign(new Discount(), data);
  }
}
