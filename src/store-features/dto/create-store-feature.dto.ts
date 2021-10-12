import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, MaxLength } from "class-validator";
import { StoreCategory } from "src/store-categories/entities/store-category.entity";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class CreateStoreFeatureDto {
  @Expose()
  @IsNotEmpty()
  @MaxLength(255)
  readonly name: string;

  @Expose()
  @Exists(StoreCategory)
  readonly storeCategoryId: number;
}
