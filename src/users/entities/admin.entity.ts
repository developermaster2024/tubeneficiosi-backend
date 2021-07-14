import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { User } from "./user.entity";

@Entity({
  name: 'admins'
})
export class Admin {
  @OneToOne(() => User, user => user.admin, { primary: true, onDelete: 'CASCADE' })
  @JoinColumn({name: 'user_id'})
  user: User;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    name: 'address',
    type: 'varchar',
    nullable: true,
  })
  address: string;

  @Column({
    name: 'img_path',
    type: 'varchar',
    nullable: true,
  })
  imgPath: string;

  static create(data: Partial<Admin>): Admin {
    return Object.assign(new Admin(), data);
  }
}
