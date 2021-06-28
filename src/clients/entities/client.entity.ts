import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity({
  name: 'clients'
})
export class Client {
  @OneToOne(() => User, {
    primary: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 50,
  })
  phoneNumber: string;

  @Column({
    name: 'img_path',
    type: 'varchar',
    nullable: true,
  })
  imgPath: string;

  static create(data: Partial<Client>): Client {
    return Object.assign(new Client(), data);
  }
}
