import { describe, expect, it } from "vitest";
import { directionFor, htmlLangFor, resolveLocale } from "./i18n";

describe("device locale selection", () => {
  it("uses the first supported preferred language", () => {
    expect(resolveLocale(["fr-CA", "ar-MA"])).toBe("fr");
  });

  it("supports Arabic and English locale variants", () => {
    expect(resolveLocale(["ar-MA"])).toBe("ar");
    expect(resolveLocale(["en-US"])).toBe("en");
  });

  it("falls back to Arabic when the device language is unsupported", () => {
    expect(resolveLocale(["es-ES"])).toBe("ar");
  });

  it("sets language and text direction consistently", () => {
    expect(htmlLangFor("ar")).toBe("ar-MA");
    expect(directionFor("ar")).toBe("rtl");
    expect(directionFor("fr")).toBe("ltr");
    expect(directionFor("en")).toBe("ltr");
  });
});
