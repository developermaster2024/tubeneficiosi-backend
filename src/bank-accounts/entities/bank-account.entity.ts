import { BankAccountPurpose } from "src/bank-account-purposes/entities/bank-account-purpose.entity";
import { BankAccountType } from "src/bank-account-types/entities/bank-account-type.entity";
import { CardIssuer } from "src/card-issuers/entities/card-issuer.entity";
import { PaymentMethod } from "src/payment-methods/entities/payment-method.entity";
import { PaymentMethods } from "src/payment-methods/enum/payment-methods.enum";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'bank_accounts',
})
export class BankAccount {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'account_number',
    type: 'varchar',
  })
  accountNumber: string;

  @Column({
    name: 'cbu',
    type: 'varchar',
  })
  cbu: string;

  @Column({
    name: 'alias',
    type: 'varchar',
  })
  alias: string;

  @Column({
    name: 'branch_office',
    type: 'varchar',
  })
  branchOffice: string;

  @Column({
    name: 'card_issuer_id',
    type: 'int',
    select: false,
  })
  cardIssuerId: number;

  @ManyToOne(() => CardIssuer, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'card_issuer_id'})
  cardIssuer: CardIssuer;

  @Column({
    name: 'bank_account_type_id',
    type: 'int',
    select: false,
  })
  bankAccountTypeId: number;

  @ManyToOne(() => BankAccountType, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'bank_account_type_id'})
  bankAccountType: BankAccountType;

  @Column({
    name: 'payment_method_code',
    type: 'varchar',
    length: 20,
  })
  paymentMethodCode: PaymentMethods;

  @ManyToOne(() => PaymentMethod, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'payment_method_code'})
  paymentMethod: PaymentMethod;

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

  static create(data: Partial<BankAccount>): BankAccount {
    return Object.assign(new BankAccount(), data);
  }
}
