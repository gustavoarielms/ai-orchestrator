import { RequestIdInterceptor } from "./request-id.interceptor";
import { CallHandler, ExecutionContext } from "@nestjs/common";
import { of } from "rxjs";

describe("RequestIdInterceptor", () => {
  let interceptor: RequestIdInterceptor;

  beforeEach(() => {
    interceptor = new RequestIdInterceptor();
  });

  const mockExecutionContext = (headers = {}) => {
    const request: any = {
      headers
    };

    const response: any = {
      setHeader: jest.fn()
    };

    return {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response
      })
    } as unknown as ExecutionContext;
  };

  const mockCallHandler: CallHandler = {
    handle: () => of("ok")
  };

  it("should generate requestId if not provided", (done) => {
    const context = mockExecutionContext();
    const next = mockCallHandler;

    interceptor.intercept(context, next).subscribe(() => {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();

      expect(request.requestId).toBeDefined();
      expect(response.setHeader).toHaveBeenCalledWith(
        "x-request-id",
        request.requestId
      );

      done();
    });
  });

  it("should use incoming x-request-id if provided", (done) => {
    const context = mockExecutionContext({
      "x-request-id": "incoming-id-123"
    });

    interceptor.intercept(context, mockCallHandler).subscribe(() => {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();

      expect(request.requestId).toBe("incoming-id-123");
      expect(response.setHeader).toHaveBeenCalledWith(
        "x-request-id",
        "incoming-id-123"
      );

      done();
    });
  });
});