import { HttpException, HttpStatus } from "@nestjs/common";

export class QuestionNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Pregunta no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}
