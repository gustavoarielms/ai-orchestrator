import { RequestContext } from "../context/request-context";

export class Logger {
  static log(message: string, context?: Record<string, any>) {
    console.log(
      JSON.stringify({
        level: "info",
        message,
        requestId: RequestContext.getRequestId(),
        ...context,
        timestamp: new Date().toISOString()
      })
    );
  }

  static error(message: string, context?: Record<string, any>) {
    console.error(
      JSON.stringify({
        level: "error",
        message,
        requestId: RequestContext.getRequestId(),
        ...context,
        timestamp: new Date().toISOString()
      })
    );
  }
}