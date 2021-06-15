import { Exclude, Expose, Type } from "class-transformer";
import { IsArray, MaxLength, ValidateNested } from "class-validator";
import { UpdateWidgetDto } from "./update-widget.dto";

@Exclude()
export class UpdateFooterSectionDto {
  @Expose()
  readonly id: string;

  @Expose()
  @MaxLength(50)
  readonly name: string;

  @Expose()
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => UpdateWidgetDto)
  readonly widgets: UpdateWidgetDto[];
}
