import { Exclude, Expose } from "class-transformer";
import { Card } from "src/cards/entities/card.entity";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class ToggleClientCardDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @Exists(Card)
  readonly cardId: number;
}
