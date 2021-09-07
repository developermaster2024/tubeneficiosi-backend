import { Client } from "src/clients/entities/client.entity";
import { Store } from "src/stores/entities/store.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "../enums/roles.enum";
import { Admin } from "./admin.entity";
import { UserStatus } from "../../user-statuses/entities/user-status.entity";
import { Order } from "src/orders/entities/order.entity";

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 150,
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
  })
  password: string;

  @Column({
    name: 'role',
    type: 'varchar',
    length: 50,
  })
  role: Role;

  @Column({
    name: 'user_status_code',
    type: 'varchar',
    length: 20,
    select: false,
  })
  userStatusCode: string;

  @ManyToOne(() => UserStatus, {nullable: false, onDelete: 'CASCADE', eager: true})
  @JoinColumn({name: 'user_status_code'})
  userStatus: UserStatus;

  @OneToOne(() => Client, client => client.user, {
    cascade: ['insert', 'update']
  })
  client: Client;

  @OneToOne(() => Store, store => store.user, {
    cascade: ['insert', 'update']
  })
  store: Store;

  @OneToOne(() => Admin, admin => admin.user, {
    cascade: ['insert', 'update']
  })
  admin: Admin;

  @OneToMany(() => Order, order => order.user)
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

  @DeleteDateColumn({
    name: 'deleted_at',
    select: false
  })
  deletedAt: Date;

  static create(data: Partial<User>): User {
    return Object.assign(new User(), data);
  }
}
