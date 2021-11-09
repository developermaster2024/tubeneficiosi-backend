import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Type } from "class-transformer";
import { ValidateIf } from "class-validator";
import { IsMimeType } from "src/validation/mime-type.constrain";
import { CreateNewsDto } from "./create-news.dto";

@Exclude()
export class UpdateNewsDto extends OmitType(CreateNewsDto, ['image'] as const) {
  @Expose()
  @Type(() => Number)
  readonly id: number;

  @Expose()
  @ValidateIf((obj) => obj.image)
  @IsMimeType(['image/png', 'image/jpeg'])
  readonly image: Express.Multer.File;
}
