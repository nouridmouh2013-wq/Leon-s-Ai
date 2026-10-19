import type { Express, Request, Response } from "express";
import { invokeLLM, type Message } from "./llm";
import { ENV } from "./env";
import { authenticateFirebaseRequest } from "../../shared/firebase-auth";

const SYSTEM_PROMPT =
  "أنت Leon's 0.1، مساعد ذكي من تطوير Med nour idmouh ضمن Leons Lab. إذا سُئلت عن اسمك أو مطوّرك، اذكر هذه المعلومات بوضوح. أجب بلغة المستخدم وبأسلوب واضح ومحترم. لا تدّعِ أن النموذج الأساسي تدرّب من الصفر لدى Leons Lab.";
const MAX_MESSAGES = 18;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_PROMPT_LENGTH = 1600;

function normalizeMessages(value: unknown): Message[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_MESSAGES) {
    return null;
  }

  const messages: Message[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const candidate = item as { role?: unknown; content?: unknown };
    if (
      (candidate.role !== "user" && candidate.role !== "assistant") ||
      typeof candidate.content !== "string" ||
      candidate.content.trim().length === 0 ||
      candidate.content.length > MAX_MESSAGE_LENGTH
    ) {
      return null;
    }
    messages.push({ role: candidate.role, content: candidate.content.trim() });
  }
  return messages;
}

function safeProviderError(error: unknown, fallback: string): string {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("429") || message.includes("rate limit")) {
    return "وصلتي لحدّ الاستعمال مؤقتاً. تسنّى شوية وعاود جرّب.";
  }
  if (message.includes("not configured") || message.includes("unauthorized")) {
    return "خدمة الذكاء الاصطناعي مازال ما تجهزاتش. راجع إعدادات الخدمة.";
  }
  return fallback;
}

function extractText(content: unknown): string {
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    return content
      .map(part =>
        part && typeof part === "object" && "text" in part && typeof part.text === "string"
          ? part.text
          : ""
      )
      .join("")
      .trim();
  }
  return "";
}

export function registerLeonsAiRoutes(app: Express) {
  app.post("/api/chat", async (req: Request, res: Response) => {
    const auth = await authenticateFirebaseRequest(req.header("authorization"));
    if (!auth.ok) {
      res.status(auth.status).json({ error: auth.message });
      return;
    }
    const messages = normalizeMessages(req.body?.messages);
    if (!messages) {
      res.status(400).json({ error: "الرسائل غير صالحة. قصّر النص وعاود المحاولة." });
      return;
    }

    try {
      const result = await invokeLLM({
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        maxTokens: 1000,
      });
      const text = extractText(result.choices?.[0]?.message?.content);
      if (!text) {
        res.status(502).json({ error: "المزوّد ما رجّع حتى جواب. عاود جرّب." });
        return;
      }
      res.json({ message: { role: "assistant", content: text } });
    } catch (error) {
      const configured = Boolean(ENV.forgeApiUrl && ENV.forgeApiKey);
      res.status(configured ? 502 : 503).json({
        error: safeProviderError(error, "ما قدرناش نتاصلو بخدمة الذكاء الاصطناعي. عاود جرّب."),
      });
    }
  });

  app.post("/api/generate-image", async (req: Request, res: Response) => {
    const auth = await authenticateFirebaseRequest(req.header("authorization"));
    if (!auth.ok) {
      res.status(auth.status).json({ error: auth.message });
      return;
    }
    const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
    if (!prompt || prompt.length > MAX_PROMPT_LENGTH) {
      res.status(400).json({ error: "كتب وصفاً للصورة (حتى 1600 حرف)." });
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(503).json({ error: "خدمة إنشاء الصور مازال ما تجهزاتش." });
      return;
    }

    try {
      const baseUrl = ENV.forgeApiUrl.replace(/\/+$/, "");
      const response = await fetch(`${baseUrl}/images.v1.ImageService/GenerateImage`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "connect-protocol-version": "1",
          authorization: `Bearer ${ENV.forgeApiKey}`,
        },
        body: JSON.stringify({ prompt }),
        signal: AbortSignal.timeout(90_000),
      });
      if (!response.ok) {
        const status = response.status;
        res.status(status === 429 ? 429 : 502).json({
          error:
            status === 429
              ? "وصلتي لحدّ إنشاء الصور مؤقتاً. عاود جرّب من بعد."
              : "تعذّر إنشاء الصورة. راجع الخدمة وحاول مرة أخرى.",
        });
        return;
      }
      const result = (await response.json()) as {
        image?: { url?: string; b64Json?: string; mimeType?: string };
        error?: unknown;
      };
      if (result.error || !result.image) {
        res.status(502).json({ error: "المزوّد ما رجّع حتى صورة. عاود جرّب." });
        return;
      }
      const url = result.image.url
        ? result.image.url
        : result.image.b64Json
          ? `data:${result.image.mimeType || "image/png"};base64,${result.image.b64Json}`
          : "";
      if (!url) {
        res.status(502).json({ error: "المزوّد رجّع نتيجة بلا ملف صورة." });
        return;
      }
      res.json({ image: { url, mimeType: result.image.mimeType || "image/png" } });
    } catch {
      res.status(502).json({ error: "ما قدرناش نتاصلو بخدمة الصور. عاود جرّب." });
    }
  });
}
