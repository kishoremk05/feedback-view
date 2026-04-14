const DEFAULT_MERCHANT_SESSION_TTL_HOURS = 6;

const parsedTtlHours = Number(import.meta.env.VITE_MERCHANT_SESSION_TTL_HOURS);

export const MERCHANT_SESSION_TTL_HOURS =
  Number.isFinite(parsedTtlHours) && parsedTtlHours > 0
    ? parsedTtlHours
    : DEFAULT_MERCHANT_SESSION_TTL_HOURS;

export const MERCHANT_SESSION_TTL_MS =
  MERCHANT_SESSION_TTL_HOURS * 60 * 60 * 1000;
