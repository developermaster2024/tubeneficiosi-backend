import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'questions',
})
export class Question {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'question',
    type: 'varchar',
  })
  question: string;

  @Column({
    name: 'answer',
    type: 'varchar',
    nullable: true,
  })
  answer: string;

  @Column({
    name: 'answered_at',
    type: 'datetime',
    nullable: true,
  })
  answeredAt: Date;

  @Column({
    name: 'product_id',
    type: 'int'
  })
  productId: number;

  @Column({
    name: 'user_id',
    type: 'int'
  })
  userId: number;

  @ManyToOne(() => User, {nullable: false})
  @JoinColumn({name: 'user_id'})
  user: User;

  @CreateDateColumn({
    name: 'created_at',
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

  static create(data: Partial<Question>): Question {
    return Object.assign(new Question(), data);
  }
}
