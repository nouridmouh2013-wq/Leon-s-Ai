import { useEffect, useState } from "react";
import type { Locale, Translation } from "@/lib/i18n";

type Catalog = Translation;
type Choice = "accepted" | "essential-only";
const CONSENT_KEY = "leons-cookie-preference-v1";
type Props = { t: Catalog; enabled?: boolean };

function CookieMark() {
  return <svg id="cookieSvg" viewBox="0 0 64 64" role="img" aria-label="Cookie"><g><path d="M52 30.4a6.4 6.4 0 0 1-6.4-6.4 6.4 6.4 0 0 1-6.4-6.4A6.4 6.4 0 0 1 32.8 11 21 21 0 1 0 53 31.2c-.35-.48-.68-.8-1-.8ZM20 33.2a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2Zm8.5 13.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4ZM30 25.5a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Zm-1 13.2a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4Z" /></g></svg>;
}

export function CookieConsent({ t, enabled = true }: Props) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    try { setVisible(localStorage.getItem(CONSENT_KEY) === null); }
    catch { setVisible(false); }
  }, [enabled]);
  function choose(choice: Choice) {
    try { localStorage.setItem(CONSENT_KEY, choice); } catch { /* The selection still dismisses this card. */ }
    setVisible(false);
  }
  if (!enabled || !visible) return null;
  return <aside className="cookie-consent-card card" aria-labelledby="cookie-heading" dir="auto">
    <CookieMark /><strong className="cookieHeading" id="cookie-heading">{t.cookieTitle}</strong><p className="cookieDescription">{t.cookieDescription}</p>
    <div className="buttonContainer"><button className="acceptButton" type="button" onClick={() => choose("accepted")}>{t.cookieAccept}</button><button className="declineButton" type="button" onClick={() => choose("essential-only")}>{t.cookieEssential}</button></div>
  </aside>;
}
