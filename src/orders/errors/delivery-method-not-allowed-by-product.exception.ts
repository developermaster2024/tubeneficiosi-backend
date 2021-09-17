import { HttpException, HttpStatus } from "@nestjs/common";
import { Product } from "src/products/entities/product.entity";

export class DeliveryMethodNotAllowedByProductException extends HttpException {
  constructor(product: Product) {
    super({
      message: 'Método de envío no permitido por el producto',
      code: 'dmt-001',
      product,
    }, HttpStatus.CONFLICT);
  }
}
