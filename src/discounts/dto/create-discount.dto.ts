import { Exclude, Expose, Type } from "class-transformer";
import { IsArray, IsDate, IsNotEmpty, IsNumber, Max, MaxLength, Min, ValidateIf } from "class-validator";
import { DiscountType } from "src/discount-types/entities/discount-type.entity";
import { DiscountTypes } from "src/discount-types/enums/discount-types.enum";
import { DateAfterField } from "src/validation/date-after-field.constrain";
import { Exists } from "src/validation/exists.constrain";
import { IsMimeType } from "src/validation/mime-type.constrain";

@Exclude()
export class CreateDiscountDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @IsNotEmpty()
  @MaxLength(255)
  readonly name: string;

  @Expose()
  @IsNotEmpty()
  @MaxLength(255)
  readonly description: string;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  readonly value: number;

  @Expose()
  @Type(() => Date)
  @IsDate()
  readonly from: Date;

  @Expose()
  @Type(() => Date)
  @IsDate()
  @DateAfterField('from')
  readonly until: Date;

  @Expose()
  @IsMimeType(['image/png', 'image/jpeg'])
  readonly image: Express.Multer.File;

  @Expose()
  @Exists(DiscountType, 'code')
  readonly discountTypeCode: DiscountTypes;

  @Expose()
  @ValidateIf((obj) => obj.discountTypeCode === DiscountTypes.CARDS)
  @IsArray()
  readonly cardIds: number[];

  @Expose()
  @ValidateIf((obj) => obj.discountTypeCode === DiscountTypes.BANK)
  @IsArray()
  readonly cardIssuerIds: number[];
}
