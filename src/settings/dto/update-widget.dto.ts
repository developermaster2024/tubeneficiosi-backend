import { OmitType } from "@nestjs/mapped-types";
import { Exclude } from "class-transformer";
import { CreateFooterWidgetDto } from "./create-footer-widget.dto";

@Exclude()
export class UpdateWidgetDto extends OmitType(CreateFooterWidgetDto, [] as const) {}
