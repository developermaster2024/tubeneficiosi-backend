import { Exclude, Expose, Transform } from "class-transformer";

@Exclude()
export class ReadNeededInfoDto {
  @Expose()
  @Transform(({obj}) => obj.value.leftSectionImage)
  readonly leftSectionImage: Express.Multer.File;

  @Expose()
  @Transform(({obj}) => obj.value.leftSectionTitle)
  readonly leftSectionTitle: string;

  @Expose()
  @Transform(({obj}) => obj.value.leftSectionDescription)
  readonly leftSectionDescription: string;

  @Expose()
  @Transform(({obj}) => obj.value.middleSectionImage)
  readonly middleSectionImage: Express.Multer.File;

  @Expose()
  @Transform(({obj}) => obj.value.middleSectionTitle)
  readonly middleSectionTitle: string;

  @Expose()
  @Transform(({obj}) => obj.value.middleSectionDescription)
  readonly middleSectionDescription: string;

  @Expose()
  @Transform(({obj}) => obj.value.rightSectionImage)
  readonly rightSectionImage: Express.Multer.File;

  @Expose()
  @Transform(({obj}) => obj.value.rightSectionTitle)
  readonly rightSectionTitle: string;

  @Expose()
  @Transform(({obj}) => obj.value.rightSectionDescription)
  readonly rightSectionDescription: string;
}
