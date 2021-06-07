import { Client } from "src/clientes/entities/client.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Roles } from "../enums/roles.enum";

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
  role: Roles;

  @OneToOne(() => Client, client => client.user, {
    cascade: ['insert', 'update']
  })
  client: Client;

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
}
