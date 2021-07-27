import { OmitType } from "@nestjs/mapped-types";
import { Expose, Type } from "class-transformer";
import { ValidateIf } from "class-validator";
import { IsMimeType } from "src/validation/mime-type.constrain";
import { CreateCardDto } from "./create-card.dto";

export class UpdateCardDto extends OmitType(CreateCardDto, ['image'] as const) {
  @Expose()
  @Type(() => Number)
  readonly id: number;

  @Expose()
  @ValidateIf((obj) => obj.image)
  @IsMimeType(['image/png', 'image/jpeg'])
  readonly image: Express.Multer.File;
}
