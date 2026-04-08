import { Request, Response, NextFunction } from "express";

interface RateLimitData {
  count: number;
  startTime: number;
}

const ipCache = new Map<string, RateLimitData>();

// Config
const LIMIT_PER_MINUTE = 100;
const WINDOW_TIME = 60 * 1000;

export const rateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction,
): void | Response => {
  const clientIP: string = (req.ip ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "unknown") as string;

  const currentTime = Date.now();
  let clientData = ipCache.get(clientIP);

  //
  if (!clientData || currentTime - clientData.startTime > WINDOW_TIME) {
    clientData = {
      count: 1,
      startTime: currentTime,
    };

    ipCache.set(clientIP, clientData);
  } else {
    clientData.count++;
  }

  const remaining = Math.max(0, LIMIT_PER_MINUTE - clientData.startTime);
  const resetTime = clientData.startTime + WINDOW_TIME;

  // Assign Header to Response
  res.setHeader("X-RateLimit-Limit", LIMIT_PER_MINUTE);
  res.setHeader("X-RateLimit-Remaining", remaining);
  res.setHeader("X-RateLimit-Reset", Math.ceil(resetTime / 1000));

  if (clientData.count > LIMIT_PER_MINUTE) {
    const retryAfter = Math.ceil((resetTime - currentTime) / 1000);

    return res.status(429).json({
      status: 429,
      error: "Too Many Requests",
      message: `You have sent too many requests. Please try after ${retryAfter} seconds.`,
    });
  }

  next();
};

setInterval(
  () => {
    const now = Date.now();
    for (const [ip, data] of ipCache.entries()) {
      if (now - data.startTime > WINDOW_TIME) {
        ipCache.delete(ip);
      }
    }
  },
  5 * 60 * 1000,
);
