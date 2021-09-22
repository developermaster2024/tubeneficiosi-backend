import { OmitType } from "@nestjs/mapped-types";
import { Expose } from "class-transformer";
import { ValidateIf } from "class-validator";
import { IsMimeType } from "src/validation/mime-type.constrain";
import { CreateDeliveryMethodDto } from "./create-delivery-method.dto";

export class UpdateDeliveryMethodDto extends OmitType(CreateDeliveryMethodDto, [
  'deliveryMethodTypeCode',
  'deliveryZoneToRanges'
] as const) {
  @Expose()
  readonly id: string;

  @Expose()
  @ValidateIf((obj) => obj.image)
  @IsMimeType(['image/png', 'image/jpeg'])
  readonly image: Express.Multer.File;
}
