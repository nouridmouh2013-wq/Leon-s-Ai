import { describe, expect, it } from "vitest";
import { isImageRequest } from "./image-intent";

describe("chat image intent", () => {
  it("detects Moroccan Arabic image requests", () => {
    expect(isImageRequest("صايب ليا تصويرة ديال قطة" )).toBe(true);
    expect(isImageRequest("ارسم ليا منظر جبلي" )).toBe(true);
  });

  it("detects English and French image requests", () => {
    expect(isImageRequest("Create an image of a red house")).toBe(true);
    expect(isImageRequest("Dessine-moi un chat" )).toBe(true);
  });

  it("does not route ordinary writing requests to image generation", () => {
    expect(isImageRequest("Write me a professional email")).toBe(false);
    expect(isImageRequest("شرح ليا كيفاش خدام توليد الصور")).toBe(false);
  });
});
