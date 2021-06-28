import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { CreateFeaturedAdDto } from "./create-featured-ad.dto";

@Exclude()
export class UpdateFeaturedAdDto extends OmitType(CreateFeaturedAdDto, [] as const) {
  @Expose()
  readonly id: string;
}
