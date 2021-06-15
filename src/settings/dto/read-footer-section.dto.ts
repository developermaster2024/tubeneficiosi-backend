import { Exclude, Expose, Type } from "class-transformer";
import { ReadWidgetDto } from "./read-widget.dto";

@Exclude()
export class ReadSectionDto {
  @Expose()
  readonly name: string;

  @Expose()
  @Type(() => ReadWidgetDto)
  readonly widgets: ReadWidgetDto[];
}
