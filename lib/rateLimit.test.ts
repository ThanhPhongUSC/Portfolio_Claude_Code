import { describe, it, expect } from "vitest";
import { createRateLimiter, getClientId } from "./rateLimit";

describe("createRateLimiter", () => {
  it("allows up to the limit, then blocks further requests", () => {
    let t = 0;
    const limiter = createRateLimiter({ limit: 3, windowMs: 1000, now: () => t });
    expect(limiter.check("a")).toBe(true);
    expect(limiter.check("a")).toBe(true);
    expect(limiter.check("a")).toBe(true);
    expect(limiter.check("a")).toBe(false); // 4th within the window
  });

  it("tracks each key independently", () => {
    const t = 0;
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => t });
    expect(limiter.check("a")).toBe(true);
    expect(limiter.check("a")).toBe(false);
    expect(limiter.check("b")).toBe(true); // a different visitor is unaffected
  });

  it("allows again once old hits slide out of the window", () => {
    let t = 0;
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000, now: () => t });
    expect(limiter.check("a")).toBe(true);
    expect(limiter.check("a")).toBe(true);
    expect(limiter.check("a")).toBe(false);
    t = 1001; // the whole window has elapsed
    expect(limiter.check("a")).toBe(true);
  });

  it("counts within a sliding window, not fixed buckets", () => {
    let t = 0;
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000, now: () => t });
    expect(limiter.check("a")).toBe(true); // at t=0
    t = 600;
    expect(limiter.check("a")).toBe(true); // at t=600
    t = 900;
    expect(limiter.check("a")).toBe(false); // both prior hits still in window
    t = 1100; // the t=0 hit expires, the t=600 one remains
    expect(limiter.check("a")).toBe(true);
  });
});

describe("getClientId", () => {
  it("uses the first entry of x-forwarded-for", () => {
    const h = new Headers({ "x-forwarded-for": "1.1.1.1, 2.2.2.2" });
    expect(getClientId(h)).toBe("1.1.1.1");
  });

  it("falls back to x-real-ip", () => {
    const h = new Headers({ "x-real-ip": "3.3.3.3" });
    expect(getClientId(h)).toBe("3.3.3.3");
  });

  it("returns 'unknown' when no client headers are present", () => {
    expect(getClientId(new Headers())).toBe("unknown");
  });
});
