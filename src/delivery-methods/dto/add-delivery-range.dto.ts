import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Type } from "class-transformer";
import { CreateDeliveryRangeDto } from "./create-delivery-range.dto";

@Exclude()
export class AddDeliveryRangeDto extends OmitType(CreateDeliveryRangeDto, [] as const) {
  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Number)
  readonly deliveryMethodId: number;}
