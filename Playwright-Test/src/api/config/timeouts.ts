import { env } from './env';

/**
 * Centralized Timeouts configuration driven by environment variables
 * Avoids hardcoded timeout numbers in spec files or client code.
 */
export const TIMEOUTS = {
  SHORT: Number(process.env.TIMEOUT_SHORT ?? 5000),
  DEFAULT: env.apiTimeout, // 30,000ms
  EXPECT: Number(process.env.TIMEOUT_EXPECT ?? 5000),
  POLL_TIMEOUT: Number(process.env.TIMEOUT_POLL ?? 15000),
  POLL_INTERVAL_FAST: Number(process.env.POLL_INTERVAL_FAST ?? 100),
  POLL_INTERVAL_NORMAL: Number(process.env.POLL_INTERVAL_NORMAL ?? 500),
} as const;

export type TimeoutProfile = keyof typeof TIMEOUTS;
