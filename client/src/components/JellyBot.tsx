import "../styles/jelly-bot.css";

type JellyBotProps = {
  size?: "small" | "normal" | "large";
  label?: string;
};

export function JellyBot({ size = "normal", label = "L’eons AI" }: JellyBotProps) {
  return (
    <div className={`nx-jelly-ai-card nx-jelly-ai-card--${size}`} role="img" aria-label={label}>
      <div className="nx-jelly-ai-bot" aria-hidden="true">
        <div className="nx-jelly-rainbow-ring" />
        <div className="nx-jelly-body">
          <div className="nx-jelly-eyes">
            <div className="nx-jelly-eye nx-jelly-eye-left" />
            <div className="nx-jelly-eye nx-jelly-eye-right" />
          </div>
        </div>
      </div>
    </div>
  );
}
