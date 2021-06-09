import { HttpException, HttpStatus } from "@nestjs/common";

export class ProfileNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Perfil no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}
