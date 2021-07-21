import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: 'password_resets',
})
export class PasswordReset {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'token',
    type: 'varchar',
  })
  token: string;

  @Column({
    name: 'email',
    type: 'varchar',
  })
  email: string;

  static create(data: Partial<PasswordReset>): PasswordReset {
    return Object.assign(new PasswordReset(), data);
  }
}
