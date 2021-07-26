import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({
  name: 'bank_account_purposes',
})
export class BankAccountPurpose {
  @PrimaryColumn({
    name: 'code',
    type: 'varchar',
    length: 20,
  })
  readonly code: string;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;
}
