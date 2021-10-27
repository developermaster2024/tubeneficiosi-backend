import { Product } from "src/products/entities/product.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity({
  name: 'show_details',
})
export class ShowDetails {
  @OneToOne(() => Product, product => product.showDetails, {primary: true, onDelete: 'CASCADE'})
  @JoinColumn({name: 'product_id'})
  product: Product;

  @Column({
    name: 'trailer',
    type: 'varchar',
  })
  trailer: string;

  static create(data: Partial<ShowDetails>): ShowDetails {
    return Object.assign(new ShowDetails(), data);
  }
}
