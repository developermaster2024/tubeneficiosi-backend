import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ClientsSummaryDto {
  @Expose()
  readonly clientsCount: number;

  @Expose()
  readonly activeClientsCount: number;

  @Expose()
  readonly bannedClientsCount: number;
}
