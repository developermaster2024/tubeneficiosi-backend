import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { IsEmail, MaxLength, ValidateIf } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { IsUnique } from "src/validation/is-unique.constrain";
import { IsMimeType } from "src/validation/mime-type.constrain";
import { Not } from "typeorm";
import { CreateClientDto } from "./create-client.dto";

@Exclude()
export class UpdateClientDto extends OmitType(CreateClientDto, ['email', 'image', 'password'] as const) {
  @Expose()
  readonly id: string;

  @Expose()
  @IsEmail()
  @MaxLength(150)
  @IsUnique(User, (value, dto: UpdateClientDto) => ({
    where: {email: value, id: Not(dto.id)},
  }))
  readonly email: string;

  @Expose()
  @ValidateIf(obj => obj.image)
  @IsMimeType(['image/jpeg', 'image/png'])
  readonly image: Express.Multer.File;
}
