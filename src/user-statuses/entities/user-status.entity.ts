import { Column, Entity, PrimaryColumn } from "typeorm";
import { UserStatuses } from "../../users/enums/user-statuses.enum";

@Entity({
  name: 'user_statuses',
})
export class UserStatus {
  @PrimaryColumn({
    name: 'code',
    type: 'varchar',
    length: 20,
  })
  code: UserStatuses;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  static create(data: Partial<UserStatus>): UserStatus {
    return Object.assign(new UserStatus(), data);
  }
}
