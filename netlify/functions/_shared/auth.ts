import { authenticateFirebaseRequest } from "../../../shared/firebase-auth";
import { jsonResponse } from "./ai";

export async function requireFirebaseUser(authorization: string | undefined) {
  const result = await authenticateFirebaseRequest(authorization);
  if (!result.ok) {
    return jsonResponse(result.status, { error: result.message });
  }
  return null;
}
