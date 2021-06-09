import { HttpException, HttpStatus } from "@nestjs/common";

export class CategoryNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Categoría no encontrada'
    }, HttpStatus.NOT_FOUND);
  }
}
