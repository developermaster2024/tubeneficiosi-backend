import { Exclude, Expose, Transform, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsIn, IsNumber, MaxLength, Min, ValidateIf, ValidateNested } from "class-validator";
import { Brand } from "src/brands/entities/brand.entity";
import { DeliveryMethodTypes, DeliveryMethodTypesValues } from "src/delivery-method-types/enums/delivery-methods-types.enum";
import { Exists } from "src/validation/exists.constrain";
import { CreateProductFeatureGroup } from "./create-product-feature-group.dto";
import { CreateProductToProductFeatureDto } from "./create-product-to-feature.dto";
import { CreateProductVideoDto } from "./create-product-video.dto";

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
  @ValidateIf((obj) => obj.reference)
  @MaxLength(255)
  readonly reference: string;

  @Expose()
  @ValidateIf((obj) => obj.shortDescription)
  @MaxLength(255)
  readonly shortDescription: string;

  @Expose()
  @ValidateIf((obj) => obj.description)
  readonly description: string;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  readonly quantity: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  readonly price: number;

  @Expose()
  @ValidateIf((obj) => obj.brandId)
  @Exists(Brand)
  readonly brandId: number;

  @Expose()
  @ValidateIf((obj) => obj.tagIds)
  @IsArray()
  @ArrayMinSize(0)
  readonly tagIds: number[];

  @Expose()
  @ValidateIf((obj) => obj.categoryIds)
  @IsArray()
  @ArrayMinSize(0)
  readonly categoryIds: number[];

  @Expose()
  @ValidateIf((obj) => obj.features)
  @Type(() => CreateProductToProductFeatureDto)
  @ValidateNested({each: true})
  readonly features: CreateProductToProductFeatureDto[];

  @Expose()
  @ValidateIf((obj) => obj.featureGroups)
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

  @Expose()
  @IsIn(DeliveryMethodTypesValues, {each: true})
  readonly deliveryMethodTypeCodes: DeliveryMethodTypes[];

  @Expose()
  @Transform(({value}) => value || [])
  @Type(() => CreateProductVideoDto)
  @ValidateNested({ each: true })
  @IsArray()
  readonly videos: CreateProductVideoDto[];
}
