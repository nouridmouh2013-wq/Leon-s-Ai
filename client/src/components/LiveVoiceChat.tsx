import { Mic, MicOff, Radio, Volume2, VolumeX, X } from "lucide-react";
import type { Translation } from "@/lib/i18n";

type Catalog = Translation;
export type VoiceStatus = "idle" | "listening" | "thinking" | "speaking" | "unsupported" | "error";

type Props = {
  active: boolean;
  muted: boolean;
  status: VoiceStatus;
  transcript: string;
  error: string;
  t: Catalog;
  onToggle: () => void;
  onMute: () => void;
};

function VoiceCrystal({ active }: { active: boolean }) {
  return (
    <div className={`voice-crystal-stage ${active ? "is-active" : ""}`} aria-hidden="true">
      {[1, 2, 3, 4, 5, 6].map(index => <span className={`voice-crystal voice-crystal-${index}`} key={index} />)}
    </div>
  );
}

export function LiveVoiceChat({ active, muted, status, transcript, error, t, onToggle, onMute }: Props) {
  const statusText = status === "listening" ? t.voiceListening
    : status === "speaking" ? t.voiceSpeaking
      : status === "thinking" ? t.voiceThinking
        : status === "unsupported" ? t.voiceUnsupported
          : error || "";

  return (
    <div className={`live-voice-control ${active ? "voice-active" : ""}`}>
      {active && (
        <section className="live-voice-panel" aria-live="polite">
          <VoiceCrystal active={status === "speaking" || status === "thinking"} />
          <div className="live-voice-copy">
            <strong>{statusText}</strong>
            {transcript && <span className="voice-transcript">{transcript}</span>}
            <small>{t.voicePrivacy}</small>
          </div>
          <button className="voice-mute-button" type="button" onClick={onMute} aria-pressed={muted} aria-label={muted ? t.voiceUnmute : t.voiceMute} title={muted ? t.voiceUnmute : t.voiceMute}>
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button className="voice-close-button" type="button" onClick={onToggle} aria-label={t.voiceStop} title={t.voiceStop}><X size={15} /></button>
        </section>
      )}
      <button className={`voice-mode-button ${active ? "is-active" : ""}`} type="button" onClick={onToggle} aria-pressed={active} aria-label={active ? t.voiceStop : t.voiceStart}>
        {active ? <MicOff size={15} /> : <Mic size={15} />}
        <span>{active ? t.voiceStop : t.voiceStart}</span>
        {active && <Radio size={13} className="voice-live-indicator" />}
      </button>
    </div>
  );
}
