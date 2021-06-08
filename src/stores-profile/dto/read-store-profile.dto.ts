import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadStoreProfileDto {
  @Expose()
  readonly whatsapp: string;

  @Expose()
  readonly instagram: string;

  @Expose()
  readonly facebook: string;

  @Expose()
  readonly youtube: string;

  @Expose()
  readonly videoUrl: string;

  @Expose()
  readonly shortDescription: string;

  @Expose()
  readonly description: string;

  @Expose()
  readonly banner: string;

  @Expose()
  readonly frontImage: string;

  @Expose()
  readonly logo: string;
}
