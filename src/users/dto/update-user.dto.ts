import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsPhoneNumber, MaxLength } from "class-validator";
import { IsUnique } from "src/validation/is-unique.constrain";
import { Not } from "typeorm";
import { User } from "../entities/user.entity";
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
}
