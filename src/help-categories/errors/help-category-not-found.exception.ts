import { HttpException, HttpStatus } from "@nestjs/common";

export class HelpCategoryNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Categoría de ayuda no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}
