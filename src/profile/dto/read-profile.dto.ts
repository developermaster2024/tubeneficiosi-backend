import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadProfileDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly phoneNumber: string;

  @Expose()
  readonly imgPath: string;

  @Expose()
  readonly isActive: boolean;
}
