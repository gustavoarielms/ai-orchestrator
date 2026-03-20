import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { Observable } from "rxjs";
import { randomUUID } from "crypto";
import { RequestContext } from "../context/request-context";

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const incomingRequestId = request.headers["x-request-id"];

    const requestId =
      typeof incomingRequestId === "string" && incomingRequestId.trim().length > 0
        ? incomingRequestId
        : randomUUID();

    request.requestId = requestId;
    response.setHeader("x-request-id", requestId);

    return new Observable((subscriber) => {
      RequestContext.run({ requestId }, () => {
        next.handle().subscribe({
          next: (value) => subscriber.next(value),
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete()
        });
      });
    });
  }
}