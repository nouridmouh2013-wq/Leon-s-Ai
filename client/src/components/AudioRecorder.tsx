import { AudioLines, Download, Mic, Pause, Play, Square, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Translation } from "@/lib/i18n";

type Catalog = Translation;
type Props = { t: Catalog; onRecordingChange?: (recording: boolean) => void; onError?: (message: string) => void };

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

export function AudioRecorder({ t, onRecordingChange, onError }: Props) {
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startTimeRef = useRef(0);
  const objectUrlRef = useRef("");

  useEffect(() => {
    onRecordingChange?.(recording);
  }, [onRecordingChange, recording]);

  useEffect(() => () => {
    recorderRef.current?.state === "recording" && recorderRef.current.stop();
    streamRef.current?.getTracks().forEach(track => track.stop());
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
  }, []);

  async function startRecording() {
    onError?.("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      onError?.(t.audioUnsupported);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const candidates = ["audio/webm;codecs=opus", "audio/mp4", "audio/webm", "audio/ogg;codecs=opus"];
      const mimeType = candidates.find(type => MediaRecorder.isTypeSupported(type));
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];
      setPlaying(false);
      setDuration(0);
      setAudioUrl("");
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = "";
      recorder.ondataavailable = event => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (blob.size > 0) {
          const url = URL.createObjectURL(blob);
          objectUrlRef.current = url;
          setAudioUrl(url);
          setDuration(Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1_000)));
        }
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        setRecording(false);
      };
      startTimeRef.current = Date.now();
      recorder.start();
      setRecording(true);
    } catch {
      onError?.(t.microphoneDenied);
      setRecording(false);
    }
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        onError?.(t.audioPlayError);
      }
    } else {
      audio.pause();
    }
  }

  function removeRecording() {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = "";
    setAudioUrl("");
    setDuration(0);
    setPlaying(false);
  }

  return (
    <div className="audio-recorder-wrap">
      <button className={`audio-record-button ${recording ? "is-recording" : ""}`} type="button" onClick={recording ? stopRecording : () => void startRecording()} aria-label={recording ? t.audioStop : t.audioStart} title={recording ? t.audioStop : t.audioStart}>
        {recording ? <Square size={15} /> : <Mic size={16} />}
      </button>
      {recording && <span className="audio-recording-label" role="status">{t.audioStop}</span>}
      {audioUrl && (
        <div className="audio-preview" dir="ltr">
          <button className="audio-play-button" type="button" onClick={() => void togglePlayback()} aria-label={playing ? t.audioPause : t.audioPlay} title={playing ? t.audioPause : t.audioPlay}>
            {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          </button>
          <div className="audio-waveform" aria-hidden="true">
            {[3, 6, 4, 8, 5, 3, 7, 4, 9, 5, 3, 6, 8, 4].map((height, index) => <span key={index} style={{ height: `${height * 3}px` }} />)}
          </div>
          <span className="audio-duration">{formatTime(duration)}</span>
          <a className="audio-download-button" href={audioUrl} download={`leons-recording.${audioUrl.startsWith("blob:") ? "webm" : "audio"}`} aria-label={t.audioDownload} title={t.audioDownload}><Download size={14} /></a>
          <button className="audio-remove-button" type="button" onClick={removeRecording} aria-label={t.audioRemove} title={t.audioRemove}><Trash2 size={14} /></button>
          <audio ref={audioRef} src={audioUrl} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} hidden />
        </div>
      )}
      {audioUrl && <span className="audio-preview-note"><AudioLines size={12} />{t.audioPreviewOnly}</span>}
    </div>
  );
}
