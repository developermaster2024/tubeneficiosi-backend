import { OmitType } from "@nestjs/mapped-types";
import { Expose } from "class-transformer";
import { CreateDeliveryMethodDto } from "./create-delivery-method.dto";

export class UpdateDeliveryMethodDto extends OmitType(CreateDeliveryMethodDto, ['deliveryMethodTypeCode', 'deliveryZoneToRanges'] as const) {
  @Expose()
  readonly id: string;
}
