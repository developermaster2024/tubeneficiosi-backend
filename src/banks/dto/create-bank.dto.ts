import { Exclude, Expose } from "class-transformer";
import { MaxLength } from "class-validator";
import { IsUnique } from "src/validation/is-unique.constrain";
import { IsMimeType } from "src/validation/mime-type.constrain";
import { Bank } from "../entities/bank.entity";

@Exclude()
export class CreateBankDto {
  @Expose()
  @MaxLength(250)
  @IsUnique(Bank)
  readonly name: string;

  @Expose()
  @IsMimeType(['image/png', 'image/jpeg'])
  readonly image: Express.Multer.File;
}
