import { Exclude, Expose, Type } from "class-transformer";
import { Store } from "src/stores/entities/store.entity";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class ToggleFavoriteStoreDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Number)
  @Exists(Store)
  readonly storeId: number;
}
