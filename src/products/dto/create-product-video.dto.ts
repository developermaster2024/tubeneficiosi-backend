import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsUrl, MaxLength } from "class-validator";

@Exclude()
export class CreateProductVideoDto {
  @Expose()
  @IsNotEmpty()
  @MaxLength(255)
  readonly name: string;

  @Expose()
  @IsNotEmpty()
  @MaxLength(255)
  @IsUrl()
  readonly url: string;
}
