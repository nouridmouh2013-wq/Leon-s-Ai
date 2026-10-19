import { LoaderCircle, ShieldCheck } from "lucide-react";
import { JellyBot } from "@/components/JellyBot";
import type { Translation } from "@/lib/i18n";

type Catalog = Translation;

type Props = {
  t: Catalog;
  configured: boolean;
  loading: boolean;
  error: string;
  onSignIn: () => void;
};

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="google-mark">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.64 5.93c4.45-4.11 7.13-10.15 7.13-17.58Z" />
      <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.75-4.59l-7.98-6.19A23.91 23.91 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.87l-7.65-5.93c-2.12 1.42-4.84 2.25-8.25 2.25-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48Z" />
    </svg>
  );
}

export function GoogleLoginGate({ t, configured, loading, error, onSignIn }: Props) {
  return (
    <div className="auth-gate">
      <section className="auth-card" aria-labelledby="auth-title">
        <div className="auth-bot"><JellyBot size="large" /></div>
        <span className="auth-brand">Leons Lab <i>·</i> {t.modelName}</span>
        <h1 id="auth-title">{configured ? t.loginTitle : t.authNotConfigured}</h1>
        <p>{configured ? t.loginDescription : t.authNotConfigured}</p>
        {error && <div className="auth-error" role="alert">{error}</div>}
        <button className="google-login-button" type="button" onClick={onSignIn} disabled={!configured || loading}>
          {loading ? <LoaderCircle size={18} className="spin" /> : <GoogleMark />}
          <span>{loading ? t.authLoading : t.continueWithGoogle}</span>
        </button>
        <div className="auth-assurance"><ShieldCheck size={14} /><span>{t.developerLine}</span></div>
      </section>
    </div>
  );
}
