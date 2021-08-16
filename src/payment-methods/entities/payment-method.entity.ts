import { BankAccount } from "src/bank-accounts/entities/bank-account.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { PaymentMethods } from "../enum/payment-methods.enum";

@Entity({
  name: 'payment_methods',
})
export class PaymentMethod {
  @PrimaryColumn({
    name: 'code',
    type: 'varchar',
  })
  code: PaymentMethods;

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
    name: 'uses_bank_accounts',
    type: 'boolean',
  })
  usesBankAccounts: boolean;

  @OneToMany(() => BankAccount, bankAccount => bankAccount.paymentMethod)
  bankAccounts: BankAccount[];

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
    select: false,
  })
  deletedAt: Date;

  static create(data: Partial<PaymentMethod>): PaymentMethod {
    return Object.assign(new PaymentMethod(), data);
  }
}
