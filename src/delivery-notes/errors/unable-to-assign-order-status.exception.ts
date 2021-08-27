import { HttpException, HttpStatus } from "@nestjs/common";

export class UnableToAssignOrderStatusException extends HttpException {
  constructor() {
    super({
      message: 'No puede asignar este estatus de orden aún',
    }, HttpStatus.CONFLICT);
  }
}
