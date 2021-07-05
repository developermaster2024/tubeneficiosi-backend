import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { CreateStoreAdDto } from "./create-store-ad.dto";

@Exclude()
export class UpdateStoreAdDto extends OmitType(CreateStoreAdDto, [] as const) {
  @Expose()
  readonly id: string;
}
