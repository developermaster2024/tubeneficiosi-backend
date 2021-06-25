import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class ReadLocationDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly area: string;

  @Expose()
  @Type(() => ReadLocationDto)
  readonly parentLocation: ReadLocationDto;
}
