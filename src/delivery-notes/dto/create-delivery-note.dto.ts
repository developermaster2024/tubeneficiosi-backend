import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsUrl, MaxLength, ValidateIf } from "class-validator";

@Exclude()
export class CreateDeliveryNoteDto {
  @Expose()
  readonly userId: number;

  @Expose()
  readonly orderId: number;

  @Expose()
  @ValidateIf(({value}) => value)
  @IsNotEmpty()
  @MaxLength(255)
  readonly trackingNumber: string;

  @Expose()
  @ValidateIf(({value}) => value)
  @MaxLength(255)
  @IsUrl()
  readonly url: string;
}
