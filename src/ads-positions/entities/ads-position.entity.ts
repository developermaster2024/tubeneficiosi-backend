import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: 'ads_positions',
})
export class AdsPosition {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;
}
