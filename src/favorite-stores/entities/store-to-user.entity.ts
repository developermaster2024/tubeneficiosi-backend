import { Store } from "src/stores/entities/store.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class StoreToUser {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'user_id',
    type: 'int',
    select: false,
  })
  userId: number;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    name: 'store_id',
    type: 'int',
    select: false,
  })
  storeId: number;

  @ManyToOne(() => Store, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  static create(data: Partial<StoreToUser>): StoreToUser {
    return Object.assign(new StoreToUser(), data);
  }
}
