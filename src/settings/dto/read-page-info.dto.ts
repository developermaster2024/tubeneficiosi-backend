import { Exclude, Expose, Transform } from "class-transformer";

@Exclude()
export class ReadPageInfoDto {
  @Expose()
  @Transform(({obj}) => obj.value.logo)
  readonly logo: string;

  @Expose()
  @Transform(({obj}) => obj.value.name)
  readonly name: string;

  @Expose()
  @Transform(({obj}) => obj.value.description)
  readonly description: string;

  @Expose()
  @Transform(({obj}) => obj.value.copyrightText)
  readonly copyrightText: string;

  @Expose()
  @Transform(({obj}) => obj.value.commissionForSale)
  readonly commissionForSale: number;
}
