import { BankAccount } from "src/bank-accounts/entities/bank-account.entity";
import { Order } from "src/orders/entities/order.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'bank_transfers',
})
export class BankTransfer {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'reference',
    type: 'varchar',
  })
  reference: string;

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 14,
    scale: 2,
  })
  amount: number;

  @Column({
    name: 'img_path',
    type: 'varchar',
    nullable: false,
  })
  imgPath: string;

  @Column({
    name: 'bank_account_id',
    type: 'int',
    select: false,
  })
  bankAccountId: number;

  @ManyToOne(() => BankAccount, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'bank_account_id'})
  bankAccount: BankAccount;

  @Column({
    name: 'order_id',
    type: 'int',
    select: false,
  })
  orderId: number;

  @ManyToOne(() => Order, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'order_id'})
  order: Order;

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

  static create(data: Partial<BankTransfer>): BankTransfer {
    return Object.assign(new BankTransfer(), data);
  }
}
