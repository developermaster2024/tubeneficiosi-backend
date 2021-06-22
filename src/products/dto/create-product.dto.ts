import { Exclude, Expose, Transform, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsNumber, MaxLength, Min, ValidateNested } from "class-validator";
import { Brand } from "src/brands/entities/brand.entity";
import { ProductFeature } from "src/product-features/entities/product-feature.entity";
import { Exists } from "src/validation/exists.constrain";

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
}

@Exclude()
class CreateProductToProductFeatureDto {
  @Expose()
  @Exists(ProductFeature)
  readonly id: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  readonly price: number;
}

@Exclude()
class CreateProductFeatureGroup {
  @Expose()
  @MaxLength(255)
  readonly name: string;

  @Expose()
  @Transform(({value}) => value === 'on')
  @IsBoolean()
  readonly isMultiSelectable: boolean;

  @Expose()
  @Type(() => CreateProductFeatureForGroup)
  @ValidateNested({each: true})
  readonly features: CreateProductFeatureForGroup[];
}

@Exclude()
class CreateProductFeatureForGroup {
  @Expose()
  @MaxLength(255)
  readonly name: string;

  @Expose()
  @MaxLength(255)
  readonly value: string;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  readonly price: number;

  @Expose()
  @Transform(({value}) => value === 'on')
  @IsBoolean()
  readonly isSelectable: boolean;
}
