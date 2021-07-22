import { Exclude, Expose, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNumber, MaxLength, Min, ValidateNested } from "class-validator";
import { Brand } from "src/brands/entities/brand.entity";
import { Exists } from "src/validation/exists.constrain";
import { CreateProductFeatureGroup } from "./create-product-feature-group.dto";
import { CreateProductToProductFeatureDto } from "./create-product-to-feature.dto";

@Exclude()
export class CreateProductDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @MaxLength(255)
  readonly name: string;

  @Expose()
  @MaxLength(255)
  readonly slug: string;

  @Expose()
  @MaxLength(255)
  readonly reference: string;

  @Expose()
  @MaxLength(255)
  readonly shortDescription: string;

  @Expose()
  @MaxLength(2500)
  readonly description: string;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  readonly quantity: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  readonly price: number;

  @Expose()
  @Exists(Brand)
  readonly brandId: number;

  @Expose()
  @IsArray()
  @ArrayMinSize(1)
  readonly tagIds: number[];

  @Expose()
  @IsArray()
  @ArrayMinSize(1)
  readonly categoryIds: number[];

  @Expose()
  @Type(() => CreateProductToProductFeatureDto)
  @ValidateNested({each: true})
  readonly features: CreateProductToProductFeatureDto[];

  @Expose()
  @Type(() => CreateProductFeatureGroup)
  @ValidateNested({each: true})
  readonly featureGroups: CreateProductFeatureGroup[];

  @Expose()
  @Type(() => Number)
  @Min(0)
  readonly width: number;

  @Expose()
  @Type(() => Number)
  @Min(0)
  readonly height: number;

  @Expose()
  @Type(() => Number)
  @Min(0)
  readonly length: number;

  @Expose()
  @Type(() => Number)
  @Min(0)
  readonly weight: number;
}
