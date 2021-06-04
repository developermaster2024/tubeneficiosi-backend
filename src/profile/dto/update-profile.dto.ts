import { OmitType } from "@nestjs/mapped-types";
import { Expose } from "class-transformer";
import { IsEmail, MaxLength } from "class-validator";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/entities/user.entity";
import { IsUnique } from "src/validation/is-unique.constrain";
import { Not } from "typeorm";

export class UpdateProfileDto extends OmitType(CreateUserDto, ['password'] as const) {
  @Expose()
  readonly userId: number;

  @Expose()
  @IsEmail()
  @MaxLength(150)
  @IsUnique(User, (value, dto: UpdateProfileDto) => ({
    where: { email: value, id: Not(dto.userId) }
  }))
  readonly email: string;
}
