import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { MaxLength, MinLength } from "class-validator";
import { IsUnique } from "src/validation/is-unique.constrain";
import { Not } from "typeorm";
import { ProfileAddress } from "../entities/profile-address.entity";
import { CreateProfileAddressDto } from "./create-profile-address.dto";

@Exclude()
export class UpdateProfileAddressDto extends OmitType(CreateProfileAddressDto, ['name']) {
  @Expose()
  readonly id: number;

  @Expose()
  @MinLength(2)
  @MaxLength(150)
  @IsUnique(ProfileAddress, (value, dto: UpdateProfileAddressDto) => ({
    where: {name: value, id: Not(dto.id)}
  }))
  readonly name: string;
}
