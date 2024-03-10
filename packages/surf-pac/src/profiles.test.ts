import { describe, expect, it } from "vitest";
import { byName, pacResult } from "./profiles";

describe("#profiles", () => {
  it("should return DIRECT for no proxy", () => {
    expect(pacResult()).toBe("DIRECT");
  });

  it("should return a valid PAC result for a proxy", () => {
    const proxy = { scheme: "http", host: "127.0.0.1", port: 8888 };
    expect(pacResult(proxy)).toBe("PROXY 127.0.0.1:8888");
  });

  it("should return special compatible result for SOCKS5", () => {
    const proxy = { scheme: "socks5", host: "127.0.0.1", port: 8888 };
    const compatibleResult = "SOCKS5 127.0.0.1:8888; SOCKS 127.0.0.1:8888";
    expect(pacResult(proxy)).toBe(compatibleResult);
  });
});

describe("#byName", () => {
  it("should get profiles from builtin profiles", () => {
    const profile = byName("direct");
    expect(profile.profileType).toEqual("DirectProfile");
  });

  it("should get profiles from given options", () => {
    const profile = {};
    expect(byName("profile", { "+profile": profile })).toBe(profile);
  });
});
