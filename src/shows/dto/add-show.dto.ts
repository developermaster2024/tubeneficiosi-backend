import { Exclude, Expose, Type } from "class-transformer";
import { IsDate } from "class-validator";
import { Place } from "src/places/entities/place.entity";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class AddShowDto {
  @Expose()
  @Type(() => Number)
  readonly productId: number;

  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Date)
  @IsDate()
  readonly date: Date;

  @Expose()
  @Exists(Place, 'id', (id, { userId }: AddShowDto) => ({
    join: {
      alias: 'place',
      innerJoin: {
        store: 'place.store',
      },
    },
    where: qb => {
      qb.where({ id })
        .andWhere('store.userId = :userId', { userId });
    },
  }))
  readonly placeId: number;
}
