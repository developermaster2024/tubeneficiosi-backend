import { Exclude, Expose, Transform } from "class-transformer";
import { IsBoolean, ValidateIf } from "class-validator";
import { IsMimeType } from "src/validation/mime-type.constrain";

@Exclude()
export class UpdatePaymentMethodDto {
  @Expose()
  readonly id: string;

  @Expose()
  @ValidateIf(obj => obj.image)
  @IsMimeType(['image/jpeg', 'image/png'])
  readonly image: Express.Multer.File;

  @Expose()
  @Transform(({value}) => value === 'on')
  @IsBoolean()
  readonly isActive: boolean;
}
