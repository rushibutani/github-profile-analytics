type LogLevel = "info" | "warn" | "error";

interface LogContext {
  [key: string]: any;
}

/**
 * Production-ready logger with structured logging
 * In production, these would go to a service like Sentry, LogRocket, etc.
 */
class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
    };

    // In development, use console with formatting
    if (this.isDevelopment) {
      const style = {
        info: "color: #3b82f6",
        warn: "color: #f59e0b",
        error: "color: #ef4444; font-weight: bold",
      }[level];

      console.log(`%c[${level.toUpperCase()}]`, style, message, context || "");
    } else {
      // In production, use structured JSON logging
      console.log(JSON.stringify(logEntry));

      // TODO: Send to external logging service
      // Example: Sentry.captureMessage(message, { level, extra: context });
    }
  }

  info(message: string, context?: LogContext) {
    this.log("info", message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log("warn", message, context);
  }

  error(message: string, error?: Error, context?: LogContext) {
    this.log("error", message, {
      ...context,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    });
  }
}

export const logger = new Logger();
