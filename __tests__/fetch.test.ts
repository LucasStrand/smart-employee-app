const mockGetToken = jest.fn();
const mockHandleUnauthorized = jest.fn();
const mockRefreshAccessToken = jest.fn();

jest.mock("@/lib/apiConfig", () => ({
  ApiType: { NEON: "neon", NEXT: "next", GRAPH: "graph" },
  API_CONFIG: {
    neon: { baseURL: "https://api.test", getToken: (...args: unknown[]) => mockGetToken(...args) },
    next: { baseURL: "", getToken: async () => null },
    graph: { baseURL: "https://graph.test", getToken: (...args: unknown[]) => mockGetToken(...args) },
  },
}));

jest.mock("@/lib/auth", () => {
  class UnauthorizedError extends Error {
    readonly status = 401;
    constructor(message = "Session expired") {
      super(message);
      this.name = "UnauthorizedError";
    }
  }
  return {
    UnauthorizedError,
    handleUnauthorized: (...args: unknown[]) => mockHandleUnauthorized(...args),
    refreshAccessToken: (...args: unknown[]) => mockRefreshAccessToken(...args),
  };
});

import { fetchAPI } from "@/lib/fetch";
import { UnauthorizedError } from "@/lib/auth";
import { ApiType } from "@/lib/apiConfig";

describe("fetchAPI", () => {
  beforeEach(() => {
    mockGetToken.mockReset();
    mockHandleUnauthorized.mockReset();
    mockRefreshAccessToken.mockReset();
    (global.fetch as jest.Mock | undefined)?.mockReset?.();
  });

  it("attaches the bearer token", async () => {
    mockGetToken.mockResolvedValue("tok-1");
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ givenName: "Lucas" }),
    });

    const data = await fetchAPI("/me", { method: "GET" }, ApiType.GRAPH);
    expect(data.givenName).toBe("Lucas");
    const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer tok-1");
  });

  it("retries once after refresh on 401", async () => {
    mockGetToken.mockResolvedValueOnce("old").mockResolvedValueOnce("new");
    mockRefreshAccessToken.mockResolvedValue("new");
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: "expired" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ ok: true }),
      });

    const data = await fetchAPI("/assigned-todolist");
    expect(data.ok).toBe(true);
    expect(mockHandleUnauthorized).not.toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("clears the session when 401 persists", async () => {
    mockGetToken.mockResolvedValue("old");
    mockRefreshAccessToken.mockResolvedValue(null);
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({}),
    });

    await expect(fetchAPI("/assigned-todolist")).rejects.toBeInstanceOf(
      UnauthorizedError
    );
    expect(mockHandleUnauthorized).toHaveBeenCalledTimes(1);
  });

  it("does not clear the session when resetOnUnauthorized is false", async () => {
    mockGetToken.mockResolvedValue("tok-1");
    mockRefreshAccessToken.mockResolvedValue(null);
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({}),
      clone: () => ({ json: async () => ({}) }),
    });

    await expect(
      fetchAPI("/user", { method: "POST" }, ApiType.NEON, {
        resetOnUnauthorized: false,
      })
    ).rejects.toBeInstanceOf(UnauthorizedError);
    expect(mockHandleUnauthorized).not.toHaveBeenCalled();
  });
});
