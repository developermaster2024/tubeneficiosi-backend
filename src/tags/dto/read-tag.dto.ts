import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadTagDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;
}
