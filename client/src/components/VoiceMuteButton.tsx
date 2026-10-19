import { Volume2, VolumeX } from "lucide-react";

type Props = { muted: boolean; onToggle: () => void; label: string };

export function VoiceMuteButton({ muted, onToggle, label }: Props) {
  return (
    <button className="voice-mute-toggle" type="button" aria-pressed={muted} aria-label={label} title={label} onClick={onToggle}>
      {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
    </button>
  );
}
