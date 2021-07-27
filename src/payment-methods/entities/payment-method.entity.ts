import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { PaymentMethods } from "../enum/payment-methods.enum";

@Entity({
  name: 'payment_methods',
})
export class PaymentMethod {
  @PrimaryColumn({
    name: 'code',
    type: 'varchar',
  })
  code: PaymentMethods;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @Column({
    name: 'img_path',
    type: 'varchar',
  })
  imgPath: string;

  @Column({
    name: 'is_active',
    type: 'boolean',
  })
  isActive: boolean;

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
    select: false,
  })
  deletedAt: Date;

  static create(data: Partial<PaymentMethod>): PaymentMethod {
    return Object.assign(new PaymentMethod(), data);
  }
}
