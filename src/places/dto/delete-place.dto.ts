import { Exclude, Expose } from "class-transformer";

@Exclude()
export class DeletePlaceDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly userId: number;
}
