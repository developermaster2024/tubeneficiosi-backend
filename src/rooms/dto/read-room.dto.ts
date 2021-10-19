import { Exclude, Expose, Type } from "class-transformer";
import { ReadSeatGroupDto } from "./read-seat-group.dto";

@Exclude()
export class ReadRoomDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  @Type(() => ReadSeatGroupDto)
  readonly seatGroups: ReadSeatGroupDto[];
}
