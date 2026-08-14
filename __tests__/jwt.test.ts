import { isTokenExpired, parseJwtPayload } from "../lib/jwt";

function makeJwt(payload: Record<string, unknown>): string {
  const json = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `eyJhbGciOiJub25lIn0.${json}.sig`;
}

describe("parseJwtPayload", () => {
  it("reads the payload JSON", () => {
    const token = makeJwt({ sub: "user-1", exp: 1_700_000_000 });
    expect(parseJwtPayload(token)).toMatchObject({
      sub: "user-1",
      exp: 1_700_000_000,
    });
  });

  it("returns null for garbage", () => {
    expect(parseJwtPayload("not-a-jwt")).toBeNull();
    expect(parseJwtPayload("")).toBeNull();
  });
});

describe("isTokenExpired", () => {
  const now = 1_700_000_000;

  it("is expired at or before exp (with 60s skew)", () => {
    const token = makeJwt({ exp: now + 30 });
    expect(isTokenExpired(token, now)).toBe(true);
  });

  it("is valid when exp is more than 60s ahead", () => {
    const token = makeJwt({ exp: now + 120 });
    expect(isTokenExpired(token, now)).toBe(false);
  });

  it("does not treat opaque tokens as expired", () => {
    expect(isTokenExpired("opaque-token", now)).toBe(false);
  });
});
