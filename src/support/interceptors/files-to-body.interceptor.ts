import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class FilesToBodyInterceptor implements NestInterceptor {
  constructor(private fileNames: string[]) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    this.fileNames.forEach(fileName => {
      const file = request.files[fileName]?.[0];

      if (file) request.body[fileName] = file;
    });

    return next.handle();
  }

}
