import type { Translation } from "@/lib/i18n";

type Catalog = Translation;
type Props = { mode: "chat" | "image"; t: Catalog };

export function ThinkingIndicator({ mode, t }: Props) {
  const label = mode === "image" ? t.generatingImage : t.analyzing;
  return (
    <div className="thinking-bubble" role="status" aria-live="polite" aria-label={label}>
      <div className="analysis-progress" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => <span className={`analysis-light analysis-light-${index + 1}`} key={index} />)}
      </div>
      <span className="analysis-message">{label}</span>
    </div>
  );
}
