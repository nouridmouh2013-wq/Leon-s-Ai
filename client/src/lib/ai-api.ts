import { localizeApiError, messages, type Locale } from "./i18n";
import { getFirebaseIdToken } from "./firebase-auth";

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export type AssistantReply = {
  message: { role: "assistant"; content: string };
};

export type GeneratedImage = {
  image: { url: string; mimeType?: string };
};

async function postJson<T>(path: string, body: unknown, locale: Locale): Promise<T> {
  let token: string | null;
  try {
    token = await getFirebaseIdToken();
  } catch {
    throw new Error(messages[locale].authRequired);
  }
  if (!token) throw new Error(messages[locale].authRequired);

  let response: Response;
  try {
    response = await fetch(path, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(messages[locale].genericError);
  }

  const result = (await response.json().catch(() => ({}))) as {
    error?: string;
  } & T;
  if (!response.ok) {
    throw new Error(
      result.error
        ? localizeApiError(result.error, locale)
        : messages[locale].genericError,
    );
  }
  return result;
}

export function sendChat(messages: ChatTurn[], locale: Locale) {
  return postJson<AssistantReply>("/api/chat", { messages }, locale);
}

export function createImage(prompt: string, locale: Locale) {
  return postJson<GeneratedImage>("/api/generate-image", { prompt }, locale);
}
