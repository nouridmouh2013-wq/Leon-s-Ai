import { Copy, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Translation } from "@/lib/i18n";

type Catalog = Translation;
type Props = { text: string; t: Catalog };

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Clipboard unavailable");
}

export function ShareButton({ text, t }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = text.trim().slice(0, 700);
  const combined = `${shareText}\n\n${pageUrl}`;
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedText = encodeURIComponent(shareText);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  async function shareFromDevice() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Leon's 0.1", text: shareText, url: pageUrl });
        setOpen(false);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    } else {
      try {
        await copyText(combined);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } catch {
        setCopied(false);
      }
    }
  }

  async function copyShare() {
    try {
      await copyText(combined);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="tooltip-container share-menu-root" ref={rootRef}>
      <button className="button-content share-trigger" type="button" aria-expanded={open} aria-haspopup="menu" aria-label={t.share} onClick={() => setOpen(value => !value)}>
        <span className="share-trigger-label">{t.share}</span><Share2 className="share-icon" size={17} />
      </button>
      {open && (
        <div className="tooltip-content share-popover" role="menu" aria-label={t.shareMenu}>
          <button type="button" role="menuitem" onClick={() => void shareFromDevice()}><Share2 size={16} />{t.shareDevice}</button>
          <button type="button" role="menuitem" onClick={() => void copyShare()}><Copy size={16} />{copied ? t.copied : t.copy}</button>
          <div className="social-icons">
            <a className="social-icon whatsapp" href={`https://wa.me/?text=${encodeURIComponent(combined)}`} target="_blank" rel="noopener noreferrer" aria-label={t.shareWhatsApp} title={t.shareWhatsApp}>
              <span className="social-letter">W</span>
            </a>
            <a className="social-icon facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" aria-label={t.shareFacebook} title={t.shareFacebook}>
              <span className="social-letter">f</span>
            </a>
            <a className="social-icon linkedin" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" aria-label={t.shareLinkedIn} title={t.shareLinkedIn}>
              <span className="social-letter">in</span>
            </a>
            <a className="social-icon twitter" href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" aria-label={t.shareX} title={t.shareX}>
              <span className="social-letter">X</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
