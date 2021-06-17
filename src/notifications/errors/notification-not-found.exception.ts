import { HttpException, HttpStatus } from "@nestjs/common";

export class NotificationNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Notificación no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}
