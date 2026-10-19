import { Check, ClipboardCopy } from "lucide-react";
import { useEffect, useState } from "react";
import type { Translation } from "@/lib/i18n";

type Catalog = Translation;
type Props = { text: string; t: Catalog };

type CopyState = "idle" | "copied" | "failed";

async function writeClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Clipboard unavailable");
}

export function CopyButton({ text, t }: Props) {
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), 1800);
    return () => window.clearTimeout(timer);
  }, [state]);

  async function copy() {
    try {
      await writeClipboard(text);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  const label = state === "copied" ? t.copied : state === "failed" ? t.copyFailed : t.copy;
  return (
    <button className={`Btn copy-button ${state === "copied" ? "is-copied" : ""}`} type="button" onClick={copy} aria-label={label} title={label}>
      <span className="text">{state === "copied" ? t.copied : t.copy}</span>
      <span className="svgIcon">{state === "copied" ? <Check size={15} /> : <ClipboardCopy size={15} />}</span>
    </button>
  );
}
