import { createRemoteJWKSet, jwtVerify } from "jose";

export type FirebaseIdentity = {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
};

export type FirebaseAuthResult =
  | { ok: true; identity: FirebaseIdentity }
  | { ok: false; status: 401 | 503; message: string };

export class FirebaseAuthNotConfiguredError extends Error {
  constructor() {
    super("Firebase Auth is not configured.");
    this.name = "FirebaseAuthNotConfiguredError";
  }
}

export class FirebaseTokenInvalidError extends Error {
  constructor() {
    super("Firebase ID token is invalid.");
    this.name = "FirebaseTokenInvalidError";
  }
}

export class FirebaseVerificationUnavailableError extends Error {
  constructor() {
    super("Firebase token verification is temporarily unavailable.");
    this.name = "FirebaseVerificationUnavailableError";
  }
}

const GOOGLE_SIGNING_KEYS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
  { timeoutDuration: 5_000, cooldownDuration: 30_000, cacheMaxAge: 10 * 60 * 60 * 1_000 },
);

export function getFirebaseProjectId(): string | null {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim() || process.env.VITE_FIREBASE_PROJECT_ID?.trim();
  return projectId || null;
}

export function getBearerToken(authorization: string | undefined): string | null {
  if (!authorization || authorization.length > 9_000) return null;
  const match = /^Bearer\s+(\S+)$/i.exec(authorization.trim());
  return match && match[1].length <= 8_192 ? match[1] : null;
}

export async function verifyFirebaseIdToken(token: string): Promise<FirebaseIdentity> {
  const projectId = getFirebaseProjectId();
  if (!projectId) throw new FirebaseAuthNotConfiguredError();
  if (!token || token.length > 8_192) throw new FirebaseTokenInvalidError();

  let payload;
  try {
    const verified = await jwtVerify(token, GOOGLE_SIGNING_KEYS, {
      algorithms: ["RS256"],
      audience: projectId,
      issuer: `https://securetoken.google.com/${projectId}`,
    });
    payload = verified.payload;
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";
    if (error instanceof TypeError || code === "ERR_JWKS_TIMEOUT" || code === "ERR_JWKS_FETCH_FAILED") {
      throw new FirebaseVerificationUnavailableError();
    }
    throw new FirebaseTokenInvalidError();
  }

  const now = Math.floor(Date.now() / 1_000);
  const firebaseClaim = payload.firebase && typeof payload.firebase === "object"
    ? payload.firebase as Record<string, unknown>
    : {};
  if (
    typeof payload.sub !== "string" ||
    !payload.sub ||
    payload.sub.length > 128 ||
    typeof payload.iat !== "number" ||
    payload.iat > now + 60 ||
    typeof payload.auth_time !== "number" ||
    payload.auth_time > now + 60 ||
    firebaseClaim.sign_in_provider !== "google.com"
  ) {
    throw new FirebaseTokenInvalidError();
  }

  return {
    uid: payload.sub,
    ...(typeof payload.email === "string" ? { email: payload.email } : {}),
    ...(typeof payload.name === "string" ? { name: payload.name } : {}),
    ...(typeof payload.picture === "string" ? { picture: payload.picture } : {}),
  };
}

export async function authenticateFirebaseRequest(
  authorization: string | undefined,
): Promise<FirebaseAuthResult> {
  const token = getBearerToken(authorization);
  if (!token) {
    return { ok: false, status: 401, message: "خاصك تسجل الدخول بحساب Google باش تستعمل التطبيق." };
  }
  try {
    return { ok: true, identity: await verifyFirebaseIdToken(token) };
  } catch (error) {
    if (error instanceof FirebaseAuthNotConfiguredError) {
      return { ok: false, status: 503, message: "إعدادات تسجيل Google مازال ناقصة في الخادم." };
    }
    if (error instanceof FirebaseVerificationUnavailableError) {
      return { ok: false, status: 503, message: "تعذّر التحقق من تسجيل Google مؤقتاً. عاود المحاولة." };
    }
    return { ok: false, status: 401, message: "تسجيل Google منتهي أو غير صالح. سجّل الدخول من جديد." };
  }
}
