export class Logger {
  static log(message: string, context?: Record<string, any>) {
    console.log(
      JSON.stringify({
        level: "info",
        message,
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
        ...context,
        timestamp: new Date().toISOString()
      })
    );
  }
}