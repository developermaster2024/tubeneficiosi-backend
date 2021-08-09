import { Exclude, Expose, Transform, Type } from "class-transformer";
import { Min } from "class-validator";
import { IsMimeType } from "src/validation/mime-type.constrain";

@Exclude()
export class CreateProductImageDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Number)
  readonly productId: number;

  @Expose()
  @IsMimeType(['image/jpeg', 'image/png'])
  readonly image: Express.Multer.File;

  @Expose()
  @Type(() => Number)
  @Min(0)
  readonly position: number;
}
