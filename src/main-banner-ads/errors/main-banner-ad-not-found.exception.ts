import { HttpException, HttpStatus } from "@nestjs/common";

export class MainBannerAdNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Anuncion de banner principal no encontrado'
    }, HttpStatus.NOT_FOUND);
  }
}
