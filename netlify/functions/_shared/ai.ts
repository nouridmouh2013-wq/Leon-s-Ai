import type { HandlerResponse } from "@netlify/functions";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 18;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_PROMPT_LENGTH = 1600;
const SYSTEM_PROMPT =
  "أنت Leon's 0.1، مساعد ذكي من تطوير Med nour idmouh ضمن Leons Lab. إذا سُئلت عن اسمك أو مطوّرك، اذكر هذه المعلومات بوضوح. أجب بلغة المستخدم وبأسلوب واضح ومحترم. لا تدّعِ أن النموذج الأساسي تدرّب من الصفر لدى Leons Lab.";

export function jsonResponse(statusCode: number, payload: unknown): HandlerResponse {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
    body: JSON.stringify(payload),
  };
}

export function parseJsonBody(body: string | null): Record<string, unknown> | null {
  if (!body || body.length > 100_000) return null;
  try {
    const parsed: unknown = JSON.parse(body);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

function providerConfig() {
  const baseUrl = process.env.AI_API_BASE_URL?.trim().replace(/\/+$/, "");
  const apiKey = process.env.AI_API_KEY?.trim();
  if (!baseUrl || !apiKey) return null;
  try {
    const parsed = new URL(baseUrl);
    if (parsed.protocol !== "https:" && parsed.hostname !== "localhost") return null;
  } catch {
    return null;
  }
  return { baseUrl, apiKey };
}

function missingConfig() {
  return jsonResponse(503, {
    error: "إعدادات مزوّد الذكاء الاصطناعي ناقصة. أضف متغيرات AI_* في إعدادات Netlify.",
  });
}

function providerFailure(status: number) {
  if (status === 401 || status === 403) {
    return "مفتاح API أو صلاحياته غير مقبولة. راجع إعدادات Netlify.";
  }
  if (status === 429) {
    return "وصلتي لحدّ الاستعمال أو الرصيد عند مزوّد الخدمة. جرّب من بعد.";
  }
  if (status >= 500) return "خدمة المزوّد ما تجاوباتش دابا. عاود جرّب من بعد.";
  return "المزوّد رفض الطلب. راجع الموديل وإعدادات الـAPI.";
}

export async function createChatReply(value: unknown) {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_MESSAGES) {
    return jsonResponse(400, { error: "الرسائل غير صالحة أو كثيرة بزاف." });
  }
  const messages: ChatMessage[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") {
      return jsonResponse(400, { error: "صيغة الرسائل غير صالحة." });
    }
    const candidate = item as Record<string, unknown>;
    if (
      (candidate.role !== "user" && candidate.role !== "assistant") ||
      typeof candidate.content !== "string" ||
      !candidate.content.trim() ||
      candidate.content.length > MAX_MESSAGE_LENGTH
    ) {
      return jsonResponse(400, { error: "رسالة غير صالحة أو طويلة بزاف." });
    }
    messages.push({ role: candidate.role, content: candidate.content.trim() });
  }

  const config = providerConfig();
  const model = process.env.AI_CHAT_MODEL?.trim();
  if (!config || !model) return missingConfig();

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${config.apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
      signal: AbortSignal.timeout(55_000),
    });
    if (!response.ok) return jsonResponse(response.status === 429 ? 429 : 502, { error: providerFailure(response.status) });
    const result = (await response.json()) as {
      error?: unknown;
      choices?: Array<{ message?: { content?: unknown } }>;
    };
    if (result.error) return jsonResponse(502, { error: "خدمة المزوّد رجّعات خطأ." });
    const content = result.choices?.[0]?.message?.content;
    const text = typeof content === "string"
      ? content.trim()
      : Array.isArray(content)
        ? content.map(part => part && typeof part === "object" && "text" in part && typeof part.text === "string" ? part.text : "").join("").trim()
        : "";
    if (!text) return jsonResponse(502, { error: "المزوّد ما رجّع حتى جواب. جرّب مرة أخرى." });
    return jsonResponse(200, { message: { role: "assistant", content: text } });
  } catch {
    return jsonResponse(502, { error: "تعذّر الاتصال بمزوّد الذكاء الاصطناعي." });
  }
}

export async function createImage(value: unknown) {
  const prompt = typeof value === "string" ? value.trim() : "";
  if (!prompt || prompt.length > MAX_PROMPT_LENGTH) {
    return jsonResponse(400, { error: "كتب وصفاً للصورة (حتى 1600 حرف)." });
  }
  const config = providerConfig();
  const model = process.env.AI_IMAGE_MODEL?.trim();
  if (!config || !model) return missingConfig();

  try {
    const response = await fetch(`${config.baseUrl}/images/generations`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${config.apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ model, prompt }),
      signal: AbortSignal.timeout(55_000),
    });
    if (!response.ok) return jsonResponse(response.status === 429 ? 429 : 502, { error: providerFailure(response.status) });
    const result = (await response.json()) as {
      error?: unknown;
      data?: Array<{ url?: string; b64_json?: string }>;
    };
    const item = result.data?.[0];
    const url = item?.url || (item?.b64_json ? `data:image/png;base64,${item.b64_json}` : "");
    if (result.error || !url) return jsonResponse(502, { error: "المزوّد ما رجّع حتى صورة." });
    return jsonResponse(200, { image: { url, mimeType: "image/png" } });
  } catch {
    return jsonResponse(502, { error: "تعذّر الاتصال بخدمة إنشاء الصور." });
  }
}
