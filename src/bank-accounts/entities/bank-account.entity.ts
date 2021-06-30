import { BankAccountType } from "src/bank-account-types/entities/bank-account-type.entity";
import { Bank } from "src/banks/entities/bank.entity";
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
    name: 'bank_id',
    type: 'int',
    select: false,
  })
  bankId: number;

  @ManyToOne(() => Bank, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'bank_id'})
  bank: Bank;

  @Column({
    name: 'bank_account_type_id',
    type: 'int',
    select: false,
  })
  bankAccountTypeId: number;

  @ManyToOne(() => BankAccountType, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'bank_account_type_id'})
  bankAccountType: BankAccountType;

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
