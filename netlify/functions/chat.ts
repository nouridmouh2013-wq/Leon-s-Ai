import type { Handler } from "@netlify/functions";
import { requireFirebaseUser } from "./_shared/auth";
import { createChatReply, jsonResponse, parseJsonBody } from "./_shared/ai";

export const handler: Handler = async event => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "الطريقة غير مدعومة." });
  }
  const denied = await requireFirebaseUser(event.headers.authorization ?? event.headers.Authorization);
  if (denied) return denied;
  const body = parseJsonBody(event.body);
  if (!body) return jsonResponse(400, { error: "الطلب غير صالح." });
  return createChatReply(body.messages);
};
