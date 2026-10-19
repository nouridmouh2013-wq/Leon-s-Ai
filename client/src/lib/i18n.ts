export type Locale = "ar" | "fr" | "en";

export const messages = {
  ar: {
    modelName: "Leon's 0.1",
    developerName: "Med nour idmouh",
    developerLine: "طوّره Med nour idmouh ضمن Leons Lab",
    newChat: "محادثة جديدة", openMenu: "فتح القائمة", closeMenu: "إغلاق القائمة",
    workspaceLabel: "مساعدك الذكي",
    modelSubtitle: "أنا Leon's 0.1 من Leons Lab. سولني أو طلب صورة هنا فالمحادثة.",
    welcomeTitle: "شنو بغيتي نعاونك فيه؟",
    welcomeBody: "سول، كتب، خطّط، ولا طلب صورة هنا. غادي نجاوبك أو نصايبها ليك فالمحادثة.",
    suggestions: ["شرح ليا شي فكرة بطريقة بسيطة", "كتب ليا إيميل احترافي", "صاوب ليا صورة ديال منظر طبيعي مغربي عند الغروب"],
    inputPlaceholder: "كتب سؤالك أو طلبك هنا…", inputAria: "اكتب رسالتك إلى Leon's 0.1",
    imageHint: "طلب صورة؟ وصفها هنا فالمحادثة", sendHint: "Enter للإرسال", newlineHint: "Shift + Enter لسطر جديد", sendAria: "إرسال الرسالة",
    disclaimer: "قد يخطئ الذكاء الاصطناعي أحياناً. راجع المعلومات المهمة.", assistantName: "Leon's 0.1",
    thinking: "كنحلل طلبك…", analyzing: "كنحلل طلبك…", generatingImage: "كنصايب الصورة…", imageWait: "غادي تبان الصورة هنا ملي توجد.", imageReady: "ها هي الصورة اللي طلبتي.", downloadImage: "تنزيل الصورة", retry: "عاود المحاولة",
    imagePromptTooLong: "وصف الصورة طويل بزاف. اختصره حتى 1600 حرف وعاود.", genericError: "تعذّر إكمال الطلب. حاول مرة أخرى.", setupError: "خدمة الذكاء الاصطناعي مازال ما تجهزاتش.", rateLimitError: "وصلتي لحدّ الاستعمال مؤقتاً. تسنّى شوية وعاود جرّب.", imageError: "تعذّر إنشاء الصورة. راجع الخدمة وحاول مرة أخرى.",
    authRequired: "سجّل الدخول بحساب Google باش تستعمل المحادثة.", authNotConfigured: "تسجيل Google مازال ما تجهزش. خاص إعداد Firebase.", authLoading: "كنتحقق من تسجيل الدخول…", loginTitle: "سجّل الدخول باش تبدا", loginDescription: "دخل بحساب Google باش تستعمل Leon's 0.1 والدردشة وإنشاء الصور.", continueWithGoogle: "المتابعة بحساب Google", signOut: "تسجيل الخروج", signInError: "ما قدرناش نسجلوك دابا. عاود المحاولة.", popupBlocked: "المتصفح منع نافذة Google. فعّل النوافذ المنبثقة أو جرّب مرة أخرى.", loginCanceled: "تلغى تسجيل الدخول.", domainNotAuthorized: "هاد النطاق مازال ما تزادش فـFirebase Authorized domains.",
    cookieTitle: "اختيارات الكوكيز", cookieDescription: "نستعمل التخزين الضروري لتشغيل الموقع وتذكّر تسجيل الدخول. ما كنستعملوش تتبّع إعلاني.", cookieAccept: "موافق", cookieEssential: "الضروري فقط",
    copy: "نسخ", copied: "تنسخ", copyFailed: "ما قدرناش ننسخو. حدّد النص وانسخو يدوياً.", share: "مشاركة", shareMenu: "اختيارات المشاركة", shareDevice: "مشاركة من الهاتف", shareWhatsApp: "واتساب", shareFacebook: "فيسبوك", shareLinkedIn: "LinkedIn", shareX: "X / Twitter", shareCopied: "تنسخ الرد ورابط الموقع.",
    voiceStart: "محادثة صوتية", voiceStop: "إيقاف الصوت الحي", voiceMute: "كتم صوت المساعد", voiceUnmute: "تشغيل صوت المساعد", voiceListening: "كنسمعك… هضر دابا", voiceThinking: "كنوجد الجواب…", voiceSpeaking: "المساعد كيهضر…", voiceUnsupported: "هاد المتصفح ما كيدعمش التعرف على الكلام. استعمل الكتابة.", voiceError: "ما قدرناش نشغلو الصوت. راجع إذن الميكروفون أو عاود المحاولة.", voicePrivacy: "الصوت كيتعرف عليه محرك المتصفح وقد يستعمل خدمة خارجية؛ التطبيق ما كيخزنش التسجيل الخام.", voiceTranscript: "الكلام اللي تلتقط…",
    audioStart: "تسجيل صوت", audioStop: "إيقاف التسجيل", audioPlay: "تشغيل التسجيل", audioPause: "إيقاف الصوت مؤقتاً", audioRemove: "حذف التسجيل", audioDownload: "تنزيل التسجيل", audioPreviewOnly: "تقدر تسمع التسجيل أو تنزلو؛ ما كيتبعتش للمساعد وما كيتحوّلش لنص.", microphoneDenied: "خاصك تسمح للمتصفح يستعمل الميكروفون باش تسجل.", audioUnsupported: "التسجيل الصوتي ما مدعومش فهاد المتصفح.", audioPlayError: "ما قدرناش نشغلو التسجيل.",
  },
  fr: {
    modelName: "Leon's 0.1", developerName: "Med nour idmouh", developerLine: "Développé par Med nour idmouh chez Leons Lab",
    newChat: "Nouvelle discussion", openMenu: "Ouvrir le menu", closeMenu: "Fermer le menu", workspaceLabel: "Votre assistant IA",
    modelSubtitle: "Je suis Leon's 0.1 de Leons Lab. Posez une question ou demandez une image dans le chat.", welcomeTitle: "Comment puis-je vous aider ?", welcomeBody: "Posez une question, rédigez, planifiez ou demandez une image. La réponse et l’image apparaîtront dans cette discussion.",
    suggestions: ["Explique-moi une idée simplement", "Rédige un e-mail professionnel", "Crée une image d’un paysage marocain au coucher du soleil"],
    inputPlaceholder: "Écrivez votre question ou demande…", inputAria: "Écrire un message à Leon's 0.1", imageHint: "Pour une image, décrivez-la dans le chat", sendHint: "Entrée pour envoyer", newlineHint: "Maj + Entrée pour aller à la ligne", sendAria: "Envoyer le message", disclaimer: "L’IA peut se tromper. Vérifiez les informations importantes.", assistantName: "Leon's 0.1",
    thinking: "J’analyse votre demande…", analyzing: "J’analyse votre demande…", generatingImage: "Je crée l’image…", imageWait: "L’image apparaîtra ici dès qu’elle sera prête.", imageReady: "Voici l’image demandée.", downloadImage: "Télécharger l’image", retry: "Réessayer", imagePromptTooLong: "La description est trop longue. Raccourcissez-la à 1 600 caractères maximum.", genericError: "La demande n’a pas abouti. Veuillez réessayer.", setupError: "Le service d’IA n’est pas encore configuré.", rateLimitError: "La limite d’utilisation est atteinte. Réessayez plus tard.", imageError: "Impossible de créer l’image. Vérifiez le service et réessayez.",
    authRequired: "Connectez-vous avec Google pour utiliser la discussion.", authNotConfigured: "Google Login n’est pas configuré. Une configuration Firebase est nécessaire.", authLoading: "Vérification de la connexion…", loginTitle: "Connectez-vous pour commencer", loginDescription: "Utilisez votre compte Google pour discuter avec Leon's 0.1 et créer des images.", continueWithGoogle: "Continuer avec Google", signOut: "Se déconnecter", signInError: "Connexion impossible. Veuillez réessayer.", popupBlocked: "Le navigateur a bloqué la fenêtre Google. Autorisez les pop-ups ou réessayez.", loginCanceled: "Connexion annulée.", domainNotAuthorized: "Ce domaine doit être ajouté aux domaines autorisés de Firebase.",
    cookieTitle: "Préférences de cookies", cookieDescription: "Le stockage nécessaire sert au site et à votre connexion. Aucun suivi publicitaire n’est utilisé.", cookieAccept: "Accepter", cookieEssential: "Nécessaires seulement", copy: "Copier", copied: "Copié", copyFailed: "Copie impossible. Sélectionnez et copiez le texte manuellement.", share: "Partager", shareMenu: "Options de partage", shareDevice: "Partager depuis l’appareil", shareWhatsApp: "WhatsApp", shareFacebook: "Facebook", shareLinkedIn: "LinkedIn", shareX: "X / Twitter", shareCopied: "Réponse et lien du site copiés.",
    voiceStart: "Discussion vocale", voiceStop: "Arrêter la voix en direct", voiceMute: "Couper la voix de l’assistant", voiceUnmute: "Activer la voix de l’assistant", voiceListening: "Je vous écoute… parlez maintenant", voiceThinking: "Je prépare une réponse…", voiceSpeaking: "L’assistant parle…", voiceUnsupported: "La reconnaissance vocale n’est pas prise en charge. Utilisez le clavier.", voiceError: "La fonction vocale n’a pas démarré. Vérifiez l’autorisation du micro et réessayez.", voicePrivacy: "La reconnaissance utilise le moteur du navigateur, qui peut traiter la voix via un service externe. L’application ne conserve pas l’audio brut.", voiceTranscript: "Texte reconnu…", audioStart: "Enregistrer l’audio", audioStop: "Arrêter l’enregistrement", audioPlay: "Lire l’enregistrement", audioPause: "Mettre en pause", audioRemove: "Supprimer l’enregistrement", audioDownload: "Télécharger l’enregistrement", audioPreviewOnly: "Écoutez ou téléchargez l’enregistrement ; il n’est pas envoyé à l’assistant ni transcrit.", microphoneDenied: "Autorisez le navigateur à accéder au microphone pour enregistrer.", audioUnsupported: "L’enregistrement audio n’est pas pris en charge par ce navigateur.", audioPlayError: "Impossible de lire l’enregistrement.",
  },
  en: {
    modelName: "Leon's 0.1", developerName: "Med nour idmouh", developerLine: "Developed by Med nour idmouh at Leons Lab", newChat: "New chat", openMenu: "Open menu", closeMenu: "Close menu", workspaceLabel: "Your AI assistant",
    modelSubtitle: "I'm Leon's 0.1 from Leons Lab. Ask a question or request an image right here.", welcomeTitle: "What can I help you with?", welcomeBody: "Ask, write, plan, or request an image. The answer and image will appear in this conversation.",
    suggestions: ["Explain an idea in simple terms", "Write a professional email", "Create an image of a Moroccan landscape at sunset"],
    inputPlaceholder: "Write your question or request…", inputAria: "Write a message to Leon's 0.1", imageHint: "Want an image? Describe it in the chat", sendHint: "Enter to send", newlineHint: "Shift + Enter for a new line", sendAria: "Send message", disclaimer: "AI can make mistakes. Check important information.", assistantName: "Leon's 0.1",
    thinking: "Analyzing your request…", analyzing: "Analyzing your request…", generatingImage: "Creating your image…", imageWait: "Your image will appear here when ready.", imageReady: "Here is the image you requested.", downloadImage: "Download image", retry: "Try again", imagePromptTooLong: "That image description is too long. Shorten it to 1,600 characters or less.", genericError: "The request could not be completed. Please try again.", setupError: "The AI service is not configured yet.", rateLimitError: "The usage limit has been reached. Please try again later.", imageError: "The image could not be created. Check the service and try again.",
    authRequired: "Sign in with Google to use the chat.", authNotConfigured: "Google sign-in is not configured yet. Firebase setup is required.", authLoading: "Checking sign-in…", loginTitle: "Sign in to get started", loginDescription: "Use your Google account to chat with Leon's 0.1 and create images.", continueWithGoogle: "Continue with Google", signOut: "Sign out", signInError: "Could not sign in. Please try again.", popupBlocked: "Your browser blocked the Google window. Allow pop-ups or try again.", loginCanceled: "Sign-in was cancelled.", domainNotAuthorized: "Add this domain to Firebase Authorized domains.",
    cookieTitle: "Cookie preferences", cookieDescription: "Essential storage keeps the site and sign-in working. No advertising trackers are used.", cookieAccept: "Accept", cookieEssential: "Essential only", copy: "Copy", copied: "Copied", copyFailed: "Copy failed. Select and copy the text manually.", share: "Share", shareMenu: "Share options", shareDevice: "Share from this device", shareWhatsApp: "WhatsApp", shareFacebook: "Facebook", shareLinkedIn: "LinkedIn", shareX: "X / Twitter", shareCopied: "Reply and site link copied.",
    voiceStart: "Live voice chat", voiceStop: "Stop live voice", voiceMute: "Mute assistant voice", voiceUnmute: "Unmute assistant voice", voiceListening: "Listening… speak now", voiceThinking: "Preparing a reply…", voiceSpeaking: "The assistant is speaking…", voiceUnsupported: "Speech recognition is not supported. Use the text chat.", voiceError: "Voice chat could not start. Check microphone permission and try again.", voicePrivacy: "Voice recognition uses your browser’s speech engine, which may process audio through an external service. The app does not store raw audio.", voiceTranscript: "Recognized speech…", audioStart: "Record audio", audioStop: "Stop recording", audioPlay: "Play recording", audioPause: "Pause recording", audioRemove: "Remove recording", audioDownload: "Download recording", audioPreviewOnly: "Listen or download the recording; it is not sent to the assistant or transcribed.", microphoneDenied: "Allow microphone access in your browser to record audio.", audioUnsupported: "Audio recording is not supported by this browser.", audioPlayError: "Could not play the recording.",
  },
} as const;

export type Translation = (typeof messages)[Locale];

export function resolveLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const primary = language.toLowerCase().split(/[-_]/, 1)[0];
    if (primary === "ar" || primary === "fr" || primary === "en") return primary;
  }
  return "ar";
}

export function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return "ar";
  return resolveLocale([...(navigator.languages ?? []), navigator.language]);
}

export function directionFor(locale: Locale): "rtl" | "ltr" { return locale === "ar" ? "rtl" : "ltr"; }
export function htmlLangFor(locale: Locale): string { return locale === "ar" ? "ar-MA" : locale; }

export function localizeApiError(message: string, locale: Locale): string {
  if (locale === "ar") return message;
  const value = message.toLowerCase();
  if (/خاصك تسجل الدخول|تسجيل google منتهي|invalid token|unauthorized|401/.test(value)) return messages[locale].authRequired;
  if (/إعدادات تسجيل google|firebase|auth.*configured|project.?id/.test(value)) return messages[locale].authNotConfigured;
  if (/429|rate.?limit|حدّ الاستعمال|حد الاستعمال|رصيد/.test(value)) return messages[locale].rateLimitError;
  if (/إعدادات|مفتاح api|مازال ما تجهز|not configured|configuration|api key/.test(value)) return messages[locale].setupError;
  if (/صورة|صور|image|photo|generation/.test(value)) return messages[locale].imageError;
  return messages[locale].genericError;
}
