import { Exclude, Expose, Transform } from "class-transformer";

@Exclude()
export class ReadAppSectionDto {
  @Expose()
  @Transform(({obj}) => obj.value.title)
  readonly title: string;

  @Expose()
  @Transform(({obj}) => obj.value.titleColor)
  readonly titleColor: string;

  @Expose()
  @Transform(({obj}) => obj.value.backgroundColor)
  readonly backgroundColor: string;

  @Expose()
  @Transform(({obj}) => obj.value.description)
  readonly description: string;

  @Expose()
  @Transform(({obj}) => obj.value.descriptionColor)
  readonly descriptionColor: string;

  @Expose()
  @Transform(({obj}) => obj.value.leftSideImage)
  readonly leftSideImage: string;

  @Expose()
  @Transform(({obj}) => obj.value.rightSideImage)
  readonly rightSideImage: string;
}
