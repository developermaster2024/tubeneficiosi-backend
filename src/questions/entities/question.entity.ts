import { Product } from "src/products/entities/product.entity";
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
    name: 'asked_by_id',
    type: 'int',
    select: false,
  })
  askedById: number;

  @ManyToOne(() => User, {nullable: false})
  @JoinColumn({name: 'asked_by_id'})
  askedBy: User;

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
    type: 'int',
    select: false,
  })
  productId: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({name: 'product_id'})
  product: Product;

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
