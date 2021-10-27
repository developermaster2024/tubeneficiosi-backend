import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadShowDetailsDto {
  @Expose()
  readonly trailer: string;
}
