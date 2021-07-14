import { PickType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { CreateStoreDto } from "./create-store.dto";

@Exclude()
export class UpdateStorePasswordDto extends PickType(CreateStoreDto, ['password'] as const) {
  @Expose()
  readonly id: string;
}
