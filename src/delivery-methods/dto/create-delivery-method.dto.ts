import { Exclude, Expose, Type } from "class-transformer";
import { IsIn, MaxLength, ValidateIf, ValidateNested } from "class-validator";
import { DeliveryMethodTypes, DeliveryMethodTypesValues } from "src/delivery-method-types/enums/delivery-methods-types.enum";
import { CreateDeliveryZoneToRangeDto } from "./create-delivery-zone-to-range.dto";
import { CreateShippingZoneToRangeDto } from "./create-shipping-zone-to-range.dto";

@Exclude()
export class CreateDeliveryMethodDto {
  @Expose()
  @MaxLength(150)
  readonly name: string;

  @Expose()
  @MaxLength(255)
  readonly description: string;

  @Expose()
  @IsIn(DeliveryMethodTypesValues)
  readonly deliveryMethodTypeCode: DeliveryMethodTypes;

  @Expose()
  @Type(() => CreateDeliveryZoneToRangeDto)
  @ValidateIf((obj) => obj.deliveryMethodTypeCode === DeliveryMethodTypes.DELIVERY)
  @ValidateNested({each: true})
  readonly deliveryZoneToRanges: CreateDeliveryZoneToRangeDto[];

  @Expose()
  @Type(() => CreateShippingZoneToRangeDto)
  @ValidateIf((obj) => obj.deliveryMethodTypeCode === DeliveryMethodTypes.SHIPPING)
  @ValidateNested({each: true})
  readonly shippingZoneToRanges: CreateShippingZoneToRangeDto[];
}
