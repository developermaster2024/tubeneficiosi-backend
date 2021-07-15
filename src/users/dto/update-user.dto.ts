import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsPhoneNumber, MaxLength, ValidateIf } from "class-validator";
import { Exists } from "src/validation/exists.constrain";
import { IsUnique } from "src/validation/is-unique.constrain";
import { IsMimeType } from "src/validation/mime-type.constrain";
import { Not } from "typeorm";
import { UserStatus } from "../../user-statuses/entities/user-status.entity";
import { User } from "../entities/user.entity";
import { UserStatuses } from "../enums/user-statuses.enum";
import { CreateUserDto } from "./create-user.dto";

@Exclude()
export class UpdateUserDto extends OmitType(CreateUserDto, ['email', 'password'] as const) {
  @Expose()
  readonly id: string;

  @Expose()
  @IsEmail()
  @MaxLength(150)
  @IsUnique(User, (value, dto: UpdateUserDto) => ({
    where: {email: value, id: Not(dto.id)}
  }))
  readonly email: string;

  @Expose()
  @MaxLength(255)
  @IsPhoneNumber()
  readonly phoneNumber: string;

  @Expose()
  @MaxLength(255)
  readonly address: string;

  @Expose()
  @Exists(UserStatus, 'code')
  readonly userStatusCode: UserStatuses;

  @Expose()
  @ValidateIf((obj) => obj.image)
  @IsMimeType(['image/jpeg', 'image/png'])
  readonly image: Express.Multer.File;
}
