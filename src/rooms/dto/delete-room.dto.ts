import { Exclude, Expose } from "class-transformer";

@Exclude()
export class DeleteRoomDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly userId: number;
}
