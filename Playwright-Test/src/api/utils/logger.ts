import { env } from '../config/env';

export type LogLevel = 'debug' | 'info' | 'error' | 'silent';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  error: 2,
  silent: 3,
};

export class Logger {
  private static get currentLevel(): number {
    const levelStr = (env.logLevel || 'info').toLowerCase() as LogLevel;
    return LOG_LEVELS[levelStr] ?? LOG_LEVELS.info;
  }

  static debug(message: string, data?: any) {
    if (this.currentLevel <= LOG_LEVELS.debug) {
      console.log(`[DEBUG] ${message}`, data !== undefined ? JSON.stringify(data, null, 2) : '');
    }
  }

  static info(message: string, data?: any) {
    if (this.currentLevel <= LOG_LEVELS.info) {
      console.log(`[INFO] ${message}`, data !== undefined ? JSON.stringify(data, null, 2) : '');
    }
  }

  static error(message: string, data?: any) {
    if (this.currentLevel <= LOG_LEVELS.error) {
      console.error(`[ERROR] ${message}`, data !== undefined ? JSON.stringify(data, null, 2) : '');
    }
  }

  static logApiCall(method: string, url: string, status: number, durationMs: number, payload?: any, responseBody?: any) {
    if (this.currentLevel > LOG_LEVELS.info) return;

    const logHeader = `[API] ${method.toUpperCase()} ${url} -> Status ${status} (${durationMs}ms)`;
    console.log(`--------------------------------------------------`);
    console.log(logHeader);

    if (payload && this.currentLevel <= LOG_LEVELS.debug) {
      console.log(`[REQUEST PAYLOAD]:`, JSON.stringify(payload, null, 2));
    }

    if (status >= 400 || this.currentLevel <= LOG_LEVELS.debug) {
      if (responseBody) {
        console.log(`[RESPONSE BODY]:`, JSON.stringify(responseBody, null, 2));
      }
    }
    console.log(`--------------------------------------------------\n`);
  }
}
