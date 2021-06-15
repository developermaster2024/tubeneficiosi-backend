import { Exclude, Expose, Transform, Type } from "class-transformer";
import { ReadSectionDto } from "./read-footer-section.dto";

@Exclude()
export class ReadFooterDto {
  @Expose()
  @Transform(({obj}) => obj.value.firstSection)
  @Type(() => ReadSectionDto)
  readonly firstSection: ReadSectionDto;

  @Expose()
  @Transform(({obj}) => obj.value.secondSection)
  @Type(() => ReadSectionDto)
  readonly secondSection: ReadSectionDto;

  @Expose()
  @Transform(({obj}) => obj.value.thirdSection)
  @Type(() => ReadSectionDto)
  readonly thirdSection: ReadSectionDto;

  @Expose()
  @Transform(({obj}) => obj.value.fourthSection)
  @Type(() => ReadSectionDto)
  readonly fourthSection: ReadSectionDto;
}
