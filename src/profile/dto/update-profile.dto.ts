import { OmitType } from "@nestjs/mapped-types";
import { Expose } from "class-transformer";
import { IsPhoneNumber, IsString, ValidateIf } from "class-validator";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { IsMimeType } from "src/validation/mime-type.constrain";

export class UpdateProfileDto extends OmitType(CreateUserDto, ['password', 'email'] as const) {
  @Expose()
  readonly userId: number;

  @Expose()
  @IsString()
  @IsPhoneNumber()
  readonly phoneNumber: string;

  @Expose()
  @ValidateIf((obj) => obj.img)
  @IsMimeType(['image/png', 'image/jpeg'])
  readonly img: Express.Multer.File;
}
