import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import slugify from "slugify";

@Injectable()
export class SlugifierInterceptor implements NestInterceptor {
  constructor(private fields: Record<string, string>) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    for(let [fieldKey, slugKey] of Object.entries(this.fields)) {
      request.body[slugKey] = `${slugify(request.body[fieldKey]?.toLowerCase() ?? '')}-${Date.now()}`;
    }

    return next.handle();
  }

}
