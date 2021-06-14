import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'settings',
})
export class Setting {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'value',
    type: 'json'
  })
  value: Object;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

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

  static create(data: Partial<Setting>): Setting {
    return Object.assign(new Setting(), data);
  }
}
