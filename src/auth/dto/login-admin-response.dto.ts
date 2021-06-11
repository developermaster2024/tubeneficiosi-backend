import { Exclude, Expose, Transform } from "class-transformer";

@Exclude()
export class LoginAdminResponse {
  @Expose()
  @Transform(({value}) => ({id: value.id, email: value.email}))
  user: {id: number; email: string};

  @Expose()
  accessToken: string;
}
