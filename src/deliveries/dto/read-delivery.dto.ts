import { Exclude, Expose, Type } from "class-transformer";
import { DeliveryZone } from "src/delivery-methods/entities/delivery-zone.entity";
import { ReadProfileAddressDto } from "src/profile-addresses/dto/read-profile-address.dto";

@Exclude()
export class ReadDeliveryDto {
  @Expose()
  readonly id: number;

  @Expose()
  @Type(() => Number)
  readonly total: number;

  @Expose()
  @Type(() => ReadProfileAddressDto)
  readonly profileAddress: ReadProfileAddressDto;

  @Expose()
  readonly deliveryZone: DeliveryZone;
}
