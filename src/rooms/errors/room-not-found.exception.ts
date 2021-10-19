import { HttpException, HttpStatus } from "@nestjs/common";

export class RoomNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Sala no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}
