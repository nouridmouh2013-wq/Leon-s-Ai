import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, Download, ImagePlus, LoaderCircle, LogOut, Menu, Plus, RefreshCw, Sparkles, X } from "lucide-react";
import type { User } from "firebase/auth";
import { AudioRecorder } from "@/components/AudioRecorder";
import { CookieConsent } from "@/components/CookieConsent";
import { CopyButton } from "@/components/CopyButton";
import { GoogleLoginGate } from "@/components/GoogleLoginGate";
import { JellyBot } from "@/components/JellyBot";
import { LiveVoiceChat, type VoiceStatus } from "@/components/LiveVoiceChat";
import { ShareButton } from "@/components/ShareButton";
import { ThinkingIndicator } from "@/components/ThinkingIndicator";
import { createImage, sendChat, type ChatTurn } from "@/lib/ai-api";
import { finishGoogleRedirect, firebaseConfigured, signInWithGoogle, signOutFromGoogle, watchFirebaseUser } from "@/lib/firebase-auth";
import { detectBrowserLocale, directionFor, htmlLangFor, localizeApiError, messages as translations, type Locale } from "@/lib/i18n";
import { isImageRequest } from "@/lib/image-intent";

type UiMessage = ChatTurn & { id: string; imageUrl?: string; imagePrompt?: string };
type RetryAction = () => void;
type SpeechRecognitionLike = {
  lang: string; continuous: boolean; interimResults: boolean;
  onresult: ((event: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((event: { error?: string }) => void) | null; onend: (() => void) | null;
  start: () => void; stop: () => void; abort: () => void;
};
type SpeechWindow = Window & { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike };
function makeId() { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
function friendlyError(error: unknown, locale: Locale) {
  const t = translations[locale];
  if (error instanceof Error && error.message) {
    if (error.message === "FIREBASE_NOT_CONFIGURED") return t.authNotConfigured;
    if (/popup-closed-by-user|cancelled-popup-request/.test(error.message)) return t.loginCanceled;
    if (/popup-blocked/.test(error.message)) return t.popupBlocked;
    if (/unauthorized-domain/.test(error.message)) return t.domainNotAuthorized;
    return localizeApiError(error.message, locale);
  }
  return t.genericError;
}
function IntroScreen({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1850);
    return () => window.clearTimeout(timer);
  }, []);
  if (!visible) return null;
  return <div className="brand-intro" role="status" aria-label="Leon's — The New Future" dir="ltr"><div className="intro-mark"><span /><span /><span /></div><h1>Leon's</h1><p>The New Future</p><span className="intro-progress" aria-hidden="true" /><span className="sr-only">{translations[locale].modelName}</span></div>;
}

export default function Home() {
  const [locale] = useState<Locale>(() => detectBrowserLocale());
  const t = translations[locale];
  const direction = directionFor(locale);
  const [introFinished, setIntroFinished] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const [busyMode, setBusyMode] = useState<"chat" | "image">("chat");
  const [chatError, setChatError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>("idle");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [audioRecording, setAudioRecording] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const retryRef = useRef<RetryAction | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const voiceActiveRef = useRef(false);
  const voiceMutedRef = useRef(false);
  const chatBusyRef = useRef(false);
  const restartVoiceRef = useRef<() => void>(() => undefined);

  useEffect(() => { document.documentElement.lang = htmlLangFor(locale); document.documentElement.dir = direction; }, [direction, locale]);
  useEffect(() => { const timer = window.setTimeout(() => setIntroFinished(true), 1850); return () => window.clearTimeout(timer); }, []);
  useEffect(() => {
    let live = true;
    void finishGoogleRedirect().catch(error => { if (live) setAuthError(friendlyError(error, locale)); });
    const unsubscribe = watchFirebaseUser(nextUser => { if (!live) return; setUser(nextUser); setAuthReady(true); setAuthError(""); }, error => { if (!live) return; setAuthReady(true); setAuthError(friendlyError(error, locale)); });
    if (!firebaseConfigured) setAuthReady(true);
    return () => { live = false; unsubscribe(); };
  }, [locale]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, chatBusy]);
  useEffect(() => { voiceActiveRef.current = voiceActive; }, [voiceActive]);
  useEffect(() => { voiceMutedRef.current = voiceMuted; if (voiceMuted) window.speechSynthesis?.cancel(); }, [voiceMuted]);
  useEffect(() => { chatBusyRef.current = chatBusy; }, [chatBusy]);

  const speak = useCallback((text: string) => {
    if (voiceMutedRef.current || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale === "ar" ? "ar-MA" : locale === "fr" ? "fr-FR" : "en-US";
    utterance.onstart = () => setVoiceStatus("speaking");
    utterance.onend = () => { if (voiceActiveRef.current) { setVoiceStatus("listening"); window.setTimeout(() => restartVoiceRef.current(), 300); } else setVoiceStatus("idle"); };
    utterance.onerror = () => { if (voiceActiveRef.current) setVoiceStatus("listening"); };
    window.speechSynthesis.speak(utterance);
  }, [locale]);

  const requestReply = useCallback(async (conversation: UiMessage[]) => {
    setChatBusy(true); chatBusyRef.current = true; setBusyMode("chat"); setChatError("");
    try {
      const result = await sendChat(conversation.map(({ role, content }) => ({ role, content })), locale);
      setMessages([...conversation, { id: makeId(), role: "assistant", content: result.message.content }]); retryRef.current = null;
      if (voiceActiveRef.current) speak(result.message.content);
    } catch (error) { setChatError(friendlyError(error, locale)); }
    finally { setChatBusy(false); chatBusyRef.current = false; if (voiceActiveRef.current) setVoiceStatus("listening"); }
  }, [locale, speak]);
  const requestImageReply = useCallback(async (conversation: UiMessage[], prompt: string) => {
    setChatBusy(true); chatBusyRef.current = true; setBusyMode("image"); setChatError("");
    try {
      const result = await createImage(prompt, locale);
      setMessages([...conversation, { id: makeId(), role: "assistant", content: t.imageReady, imageUrl: result.image.url, imagePrompt: prompt }]); retryRef.current = null;
      if (voiceActiveRef.current) speak(t.imageReady);
    } catch (error) { setChatError(friendlyError(error, locale)); }
    finally { setChatBusy(false); chatBusyRef.current = false; if (voiceActiveRef.current) setVoiceStatus("listening"); }
  }, [locale, speak, t.imageReady]);
  const sendMessage = useCallback((value: string) => {
    const text = value.trim();
    if (!text || chatBusyRef.current) return;
    const wantsImage = isImageRequest(text);
    if (wantsImage && text.length > 1600) { setChatError(t.imagePromptTooLong); return; }
    inputRef.current?.blur();
    const next: UiMessage[] = [...messages, { id: makeId(), role: "user", content: text }];
    setMessages(next); setDraft(""); setChatError("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    if (wantsImage) { retryRef.current = () => void requestImageReply(next, text); void requestImageReply(next, text); }
    else { retryRef.current = () => void requestReply(next); void requestReply(next); }
  }, [messages, requestImageReply, requestReply, t.imagePromptTooLong]);

  function startVoice() {
    const SpeechRecognition = (window as SpeechWindow).SpeechRecognition || (window as SpeechWindow).webkitSpeechRecognition;
    if (!SpeechRecognition) { setVoiceActive(true); voiceActiveRef.current = true; setVoiceStatus("unsupported"); return; }
    setVoiceError(""); setVoiceActive(true); voiceActiveRef.current = true; setVoiceStatus("listening");
    const recognition = new SpeechRecognition();
    recognition.lang = locale === "ar" ? "ar-MA" : locale === "fr" ? "fr-FR" : "en-US";
    recognition.continuous = false; recognition.interimResults = true;
    recognition.onresult = event => {
      let interim = ""; let finalText = "";
      for (let index = event.resultIndex; index < event.results.length; index++) { const item = event.results[index]; if (item.isFinal) finalText += item[0]?.transcript ?? ""; else interim += item[0]?.transcript ?? ""; }
      setVoiceTranscript((finalText || interim).trim());
      if (finalText.trim()) { setVoiceStatus("thinking"); window.setTimeout(() => sendMessage(finalText.trim()), 0); }
    };
    recognition.onerror = () => { setVoiceError(t.voiceError); setVoiceStatus("error"); };
    recognition.onend = () => {
      if (recognitionRef.current === recognition) recognitionRef.current = null;
      if (voiceActiveRef.current && !chatBusyRef.current && !window.speechSynthesis?.speaking) {
        setVoiceStatus("listening");
        window.setTimeout(() => { if (voiceActiveRef.current && !chatBusyRef.current && !window.speechSynthesis?.speaking) { try { recognition.start(); recognitionRef.current = recognition; } catch { /* The browser may reject a rapid restart. */ } } }, 450);
      }
    };
    recognitionRef.current = recognition;
    try { recognition.start(); } catch { setVoiceError(t.voiceError); setVoiceStatus("error"); }
  }
  restartVoiceRef.current = () => { if (voiceActiveRef.current && !chatBusyRef.current && !window.speechSynthesis?.speaking && !recognitionRef.current) startVoice(); };
  function stopVoice() { voiceActiveRef.current = false; setVoiceActive(false); recognitionRef.current?.abort(); recognitionRef.current = null; window.speechSynthesis?.cancel(); setVoiceStatus("idle"); setVoiceTranscript(""); }
  function toggleVoice() { if (voiceActive) stopVoice(); else startVoice(); }
  function startNewChat() { if (chatBusy) return; setMessages([]); setDraft(""); setChatError(""); retryRef.current = null; setSidebarOpen(false); }
  function downloadImage(message: UiMessage) { if (!message.imageUrl) return; const anchor = document.createElement("a"); anchor.href = message.imageUrl; anchor.download = "leons-0-1-image.png"; anchor.target = "_blank"; anchor.rel = "noopener noreferrer"; anchor.click(); }

  if (!introFinished) return <IntroScreen locale={locale} />;
  if (!authReady) return <><div className="auth-loading-screen"><LoaderCircle size={22} className="spin" />{t.authLoading}</div><CookieConsent t={t} enabled={introFinished} /></>;
  if (!user) return <><GoogleLoginGate t={t} configured={firebaseConfigured} loading={authBusy} error={authError} onSignIn={() => { setAuthBusy(true); setAuthError(""); void signInWithGoogle().catch(error => setAuthError(friendlyError(error, locale))).finally(() => setAuthBusy(false)); }} /><CookieConsent t={t} enabled={introFinished} /></>;

  const sidebar = <><button className="sidebar-new-chat" onClick={startNewChat} disabled={chatBusy}><Plus size={17} strokeWidth={2.2} /><span>{t.newChat}</span></button><div className="sidebar-label">{t.workspaceLabel}</div><div className="sidebar-note"><div className="sidebar-note-icon"><Sparkles size={16} /></div><div><strong>{t.modelName}</strong><span>{t.developerLine}</span></div></div></>;
  return <div className="app-shell" dir={direction}>
    {sidebarOpen && <button className="mobile-backdrop" aria-label={t.closeMenu} onClick={() => setSidebarOpen(false)} />}
    <aside className={`app-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}><div className="brand-lockup"><div className="brand-mark"><JellyBot size="small" /></div><div className="brand-copy"><span className="brand-name">Leon's <b>0.1</b></span><span className="brand-byline">{t.developerLine}</span></div><button className="sidebar-close" aria-label={t.closeMenu} onClick={() => setSidebarOpen(false)}><X size={18} /></button></div><nav className="sidebar-nav" aria-label={t.workspaceLabel}>{sidebar}</nav><div className="sidebar-spacer" /><div className="sidebar-footer"><span className="footer-orb" /><div><strong>Leons Lab</strong><span>{t.developerName}</span></div><span className="version-tag">0.1</span></div></aside>
    <main className="main-area"><header className="topbar"><button className="mobile-menu" aria-label={t.openMenu} onClick={() => setSidebarOpen(true)}><Menu size={20} /></button><div className="mobile-brand"><JellyBot size="small" /><span>Leon's <b>0.1</b></span></div><div className="breadcrumbs"><span>Leons Lab</span><span className="breadcrumb-separator">·</span><strong>{t.modelName}</strong></div><div className="topbar-right"><span className="model-pill"><Sparkles size={13} />{t.modelName}</span><button className="account-pill" onClick={() => { void signOutFromGoogle(); stopVoice(); }} title={t.signOut} aria-label={t.signOut}>{user.photoURL ? <img src={user.photoURL} alt="" /> : <LogOut size={15} />}</button></div></header>
      <div className="workspace"><section className="workspace-heading"><div><div className="eyebrow"><span className="eyebrow-dot" />{t.workspaceLabel}</div><h1>{t.modelName}</h1><p>{t.modelSubtitle}</p></div><div className="developer-chip">{t.developerLine}</div></section>
        <section className="chat-panel" aria-label={t.modelName}>
          {messages.length === 0 ? <div className="welcome-state"><div className="welcome-bot"><JellyBot size="large" /></div><div className="welcome-kicker">{t.modelName}<span>·</span>Leons Lab</div><h2>{t.welcomeTitle}</h2><p>{t.welcomeBody}</p><div className="suggestion-list">{t.suggestions.map((suggestion, index) => <button key={suggestion} onClick={() => sendMessage(suggestion)} disabled={chatBusy}><span>{suggestion}</span><ArrowUp size={15} className={`suggestion-arrow suggestion-arrow-${index}`} /></button>)}</div></div> : <div className="chat-thread" aria-live="polite">
            {messages.map(message => <article className={`message-row message-row--${message.role}`} key={message.id}>{message.role === "assistant" && <div className="message-avatar"><JellyBot size="small" label={t.assistantName} /></div>}<div className={`message-bubble message-bubble--${message.role}`}>{message.role === "assistant" && <div className="message-author">{t.assistantName}</div>}<p>{message.content}</p>{message.imageUrl && <div className="inline-image-card"><div className="inline-image-canvas" dir="ltr"><img src={message.imageUrl} alt={message.imagePrompt || t.imageReady} /></div><div className="inline-image-details" dir={direction}><span>{message.imagePrompt}</span><button className="image-action-button" onClick={() => downloadImage(message)}><Download size={14} />{t.downloadImage}</button></div></div>}{message.role === "assistant" && <div className="message-actions"><CopyButton text={message.content} t={t} /><ShareButton text={message.content} t={t} /></div>}</div></article>)}
            {chatBusy && <div className={`message-row message-row--assistant ${busyMode === "image" ? "message-row--image" : ""}`}><div className="message-avatar"><JellyBot size="small" label={t.assistantName} /></div><div>{busyMode === "image" && <span className="thinking-image-hint">{t.imageWait}</span>}<ThinkingIndicator mode={busyMode} t={t} /></div></div>}
            {chatError && <div className="inline-error" role="alert"><span>{chatError}</span>{retryRef.current && <button onClick={() => retryRef.current?.()} disabled={chatBusy}><RefreshCw size={14} />{t.retry}</button>}</div>}<div ref={endRef} />
          </div>}
          <div className="composer-wrap"><LiveVoiceChat active={voiceActive} muted={voiceMuted} status={voiceStatus} transcript={voiceTranscript} error={voiceError} t={t} onToggle={toggleVoice} onMute={() => setVoiceMuted(value => !value)} />
            <form className="composer" onSubmit={event => { event.preventDefault(); sendMessage(draft); }}><textarea ref={inputRef} value={draft} onChange={event => { setDraft(event.target.value); event.target.style.height = "auto"; event.target.style.height = `${Math.min(event.target.scrollHeight, 160)}px`; }} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(draft); } }} placeholder={t.inputPlaceholder} rows={1} maxLength={4000} aria-label={t.inputAria} /><div className="composer-bottom"><span className="composer-hint"><ImagePlus size={13} />{t.imageHint}</span><span className="composer-shortcut">{t.sendHint}<i>·</i>{t.newlineHint}</span><AudioRecorder t={t} onRecordingChange={setAudioRecording} onError={setVoiceError} /><button className="send-button" type="submit" disabled={!draft.trim() || chatBusy || audioRecording} aria-label={t.sendAria}>{chatBusy ? <LoaderCircle size={17} className="spin" /> : <ArrowUp size={18} />}</button></div></form><p className="disclaimer">{t.disclaimer}</p>
          </div>
        </section><footer className="workspace-footer"><span>{t.modelName}<i>·</i>Leons Lab</span><span>{t.developerLine}</span></footer>
      </div>
    </main><CookieConsent t={t} enabled={introFinished} />
  </div>;
}
