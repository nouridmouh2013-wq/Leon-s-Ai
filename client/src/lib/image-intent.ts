const arabicImageRequest =
  /(?:صايب|صاوب|صوب|صوّب|صنع|أنشئ|انشئ|ارسم|رسم|ولّد|ولد|عطيني|اعطيني).{0,80}(?:صورة|تصويرة|رسمة|رسم|تصوير)/iu;
const arabicDrawRequest = /(?:ارسم|صوّر|صور)\s*(?:لي|ليا|لينا)?\s*\S+/iu;
const englishImageRequest =
  /\b(?:create|generate|make)\b.{0,60}\b(?:image|picture|photo|illustration)\b/i;
const englishDrawRequest = /\b(?:draw|paint)\s+(?:me\s+)?(?:a|an|the)?\s*\w+/i;
const frenchImageRequest =
  /\b(?:crée|cree|créer|creer|génère|genere|dessine|fais|fabrique)\b.{0,60}\b(?:image|photo|illustration|dessin)\b/i;
const frenchDrawRequest = /\b(?:dessine|peins)[-\s]+(?:moi[-\s]+)?(?:un|une|le|la)?\s*\w+/i;

export function isImageRequest(text: string): boolean {
  const value = text.trim();
  if (!value) return false;
  return (
    arabicImageRequest.test(value) ||
    arabicDrawRequest.test(value) ||
    englishImageRequest.test(value) ||
    englishDrawRequest.test(value) ||
    frenchImageRequest.test(value) ||
    frenchDrawRequest.test(value)
  );
}
