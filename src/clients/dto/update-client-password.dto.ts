import { PickType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { CreateClientDto } from "./create-client.dto";

@Exclude()
export class UpdateClientPasswordDto extends PickType(CreateClientDto, ['password'] as const) {
  @Expose()
  readonly id: string;
}
