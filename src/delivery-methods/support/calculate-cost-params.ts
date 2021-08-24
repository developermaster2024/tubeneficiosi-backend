import { Product } from "src/products/entities/product.entity";

export type CalculateCostParams = {
  addressId: number;
  deliveryMethodId: number;
  products: {product: Product, quantity: number}[];
}
