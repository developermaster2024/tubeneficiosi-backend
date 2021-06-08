import { Client } from "src/clientes/entities/client.entity";
import { Store } from "src/stores/entities/store.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "../enums/roles.enum";

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
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    name: 'role',
    type: 'varchar',
    length: 50,
  })
  role: Role;

  @OneToOne(() => Client, client => client.user, {
    cascade: ['insert', 'update']
  })
  client: Client;

  @OneToOne(() => Store, store => store.user, {
    cascade: ['insert', 'update']
  })
  store: Store;

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
