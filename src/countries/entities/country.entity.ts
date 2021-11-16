import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'countries',
})
export class Country {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @Column({
    name: 'code',
    type: 'varchar',
    length: 3,
  })
  code: string;

  @Column({
    name: 'dial_code',
    type: 'varchar',
    length: 10,
  })
  dialCode: string;

  @Column({
    name: 'img_path',
    type: 'varchar',
  })
  imgPath: string;

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

  static create(data: Partial<Country>): Country {
    return Object.assign(new Country(), data);
  }
}
