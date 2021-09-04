import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Type } from "class-transformer";
import { ValidateIf } from "class-validator";
import { IsMimeType } from "src/validation/mime-type.constrain";
import { CreateDiscountDto } from "./create-discount.dto";

@Exclude()
export class UpdateDiscountDto extends OmitType(CreateDiscountDto, [
  'value',
  'cardIds',
  'cardIssuerIds',
  'discountTypeCode',
  'until',
  'from',
] as const) {
  @Expose()
  @Type(() => Number)
  readonly id: number;

  @Expose()
  @ValidateIf((obj) => obj.image)
  @IsMimeType(['image/png', 'image/jpeg'])
  readonly image: Express.Multer.File;
}
