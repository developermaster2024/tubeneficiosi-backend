import { Exclude, Expose, Transform } from "class-transformer";

@Exclude()
export class ReadBusinessInfoDto {
  @Expose()
  @Transform(({obj}) => obj.value.sectionTitle)
  readonly sectionTitle: string;

  @Expose()
  @Transform(({obj}) => obj.value.leftSectionImage)
  readonly leftSectionImage: string;

  @Expose()
  @Transform(({obj}) => obj.value.leftSectionTitle)
  readonly leftSectionTitle: string;

  @Expose()
  @Transform(({obj}) => obj.value.leftSectionText)
  readonly leftSectionText: string;

  @Expose()
  @Transform(({obj}) => obj.value.leftSectionBtnColor)
  readonly leftSectionBtnColor: string;

  @Expose()
  @Transform(({obj}) => obj.value.leftSectionBtnText)
  readonly leftSectionBtnText: string;

  @Expose()
  @Transform(({obj}) => obj.value.leftSectionBtnUrl)
  readonly leftSectionBtnUrl: string;

  @Expose()
  @Transform(({obj}) => obj.value.rightSectionImage)
  readonly rightSectionImage: string;

  @Expose()
  @Transform(({obj}) => obj.value.rightSectionTitle)
  readonly rightSectionTitle: string;

  @Expose()
  @Transform(({obj}) => obj.value.rightSectionText)
  readonly rightSectionText: string;

  @Expose()
  @Transform(({obj}) => obj.value.rightSectionBtnColor)
  readonly rightSectionBtnColor: string;

  @Expose()
  @Transform(({obj}) => obj.value.rightSectionBtnText)
  readonly rightSectionBtnText: string;

  @Expose()
  @Transform(({obj}) => obj.value.rightSectionBtnUrl)
  readonly rightSectionBtnUrl: string;
}
