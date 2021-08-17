import { Exclude, Expose, Type } from "class-transformer";
import { IsIn, MaxLength, ValidateIf, ValidateNested } from "class-validator";
import { DeliveryMethodTypes, DeliveryMethodTypesValues } from "src/delivery-method-types/enums/delivery-methods-types.enum";
import { IsMimeType } from "src/validation/mime-type.constrain";
import { CreateDeliveryZoneToRangeDto } from "./create-delivery-zone-to-range.dto";
import { CreateShippingZoneToRangeDto } from "./create-shipping-zone-to-range.dto";

@Exclude()
export class CreateDeliveryMethodDto {
  @Expose()
  readonly userId: number;

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
  @IsMimeType(['image/png', 'image/jpeg'])
  readonly image: Express.Multer.File;

  @Expose()
  @Type(({object}) => object.deliveryMethodTypeCode === DeliveryMethodTypes.DELIVERY ? CreateDeliveryZoneToRangeDto : CreateShippingZoneToRangeDto)
  @ValidateNested({each: true})
  readonly deliveryZoneToRanges: CreateShippingZoneToRangeDto[] | CreateDeliveryZoneToRangeDto[];
}
