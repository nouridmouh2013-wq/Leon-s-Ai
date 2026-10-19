# نشر Leon's 0.1 على Netlify

## اختَر الحزمة وطريقة النشر الصحيحة

- **`Leons-AI-Netlify-Drop.zip`**: ملفات ثابتة جاهزة، فيها `index.html` والأصول عند الجذر. يمكن فكّها ثم رفع المجلد إلى Netlify Drop حتى تظهر الواجهة. لكنها لا تتضمن Functions؛ لذلك الدردشة وتوليد الصور لن يعملا على هذه النسخة وحدها.
- **`Leons-AI-Netlify-Source.zip`**: ملفات المصدر مع `netlify.toml` وNetlify Functions. هذه هي الحزمة اللازمة لتشغيل الدردشة والصور؛ يجب نشرها من مجلد المشروع عبر Git أو Netlify CLI، وليس رفع ZIP المصدر إلى Netlify Drop.

الواجهة تعرض Leon's 0.1، وتختار العربية أو الفرنسية أو الإنجليزية من تفضيل المتصفح/الجهاز. طلب الصورة يُكتب في المحادثة وتظهر النتيجة داخلها على لوحة بيضاء، من دون صفحة مستقلة.

## نشر التطبيق الكامل: Git وNetlify

1. فكّ ضغط **حزمة المصدر**.
2. ارفع محتويات مجلد المشروع كلها إلى مستودع Git جديد في GitHub أو GitLab. تأكد أن `netlify.toml` و`package.json` في جذر المستودع، لا داخل مجلد فرعي إضافي.
3. في Netlify اختَر **Add new project → Import an existing project** واربط المستودع.
4. خلّي Netlify يستعمل `netlify.toml`: أمر البناء `pnpm build:static`، مجلد النشر `dist/public`، ووظائف الخلفية `netlify/functions`.
5. أضف متغيرات API السرية المذكورة أدناه في إعدادات الموقع، ثم أطلق النشر.

## تفعيل تسجيل Google

أنشئ مشروع Firebase، فعّل **Authentication → Google**، وسجّل تطبيق Web. أضف دومين Netlify النهائي في **Authentication → Settings → Authorized domains**. أضف متغيرات Firebase التالية في Netlify كمتغيرات بناء: `VITE_FIREBASE_API_KEY` و`VITE_FIREBASE_AUTH_DOMAIN` و`VITE_FIREBASE_PROJECT_ID` و`VITE_FIREBASE_APP_ID`؛ ويمكن إضافة `VITE_FIREBASE_MESSAGING_SENDER_ID`. أضف `FIREBASE_PROJECT_ID` أيضاً لمتغيرات Netlify Functions بالقيمة نفسها. قيم `VITE_` إعدادات ويب عامة ظاهرة للمتصفح، وليست مفاتيح مزود الذكاء الاصطناعي. لا تضع مفتاح AI في متغير يبدأ بـ`VITE_`. أعد النشر بعد ضبطها. وظائف المحادثة والصور ترفض الطلبات بلا Google ID token صالح.

## نشر التطبيق الكامل من جهازك عبر Netlify CLI

تحتاج Node.js (الإصدار 22 موصى به) و`npm`. افتح Terminal أو PowerShell في جذر المشروع بعد فك الضغط وشغّل:

```bash
npm install -g pnpm netlify-cli
pnpm install --frozen-lockfile
netlify login
netlify deploy
```

سيفتح المتصفح لتسجيل الدخول، وفي أول نشر سيطلب CLI اختيار موقع Netlify موجود أو إنشاء موقع جديد. أمر `netlify deploy` يقرأ `netlify.toml` ويشغّل البناء ويرفع الواجهة ووظائف Netlify معاً. بعد ما يتسجل الموقع، أضف متغيرات البيئة من لوحة Netlify، ثم انشر النسخة المباشرة:

```bash
netlify deploy --prod
```

## مفاتيح وموديلات المزوّد

من **Site configuration → Environment variables** أضف القيم التالية. خذ عنوان الـAPI والمفتاح ومعرّفات الموديلات من مزوّد يدعم واجهات متوافقة مع OpenAI للدردشة والصور:

- `AI_API_BASE_URL`: عنوان HTTPS الأساسي للمزوّد، مثل `https://api.openai.com/v1` إذا اخترت OpenAI، أو العنوان الذي يعطيه مزوّدك.
- `AI_API_KEY`: المفتاح السري من المزوّد.
- `AI_CHAT_MODEL`: اسم موديل الدردشة المتاح في حسابك.
- `AI_IMAGE_MODEL`: اسم موديل الصور المتاح في حسابك.

الكود يستعمل عنوان API الأساسي نفسه للمحادثة (`/chat/completions`) وللصور (`/images/generations`). بعض المزوّدين لا يوفّرون توليد الصور أو يستعملون صيغة مختلفة؛ يجب أن يدعم المزوّد والموديل هذين المسارين. لا يمكن ضمان أن التوليد مجاني؛ الثمن والحدود يحددهما المزوّد.

يبقى المفتاح محفوظاً في إعدادات Netlify إلى أن تبدّله أو تحذفه. **لا تلصقه في ملفات الكود أو واجهة المتصفح أو رسائل الدردشة.** ملف `.env.example` فيه أسماء المتغيرات فقط بلا قيم سرية. بعد إضافة أو تغيير المتغيرات، أعد النشر لتُطبّق على الوظائف.

## محتويات المشروع والهوية

- `netlify.toml`: إعداد البناء ومسارات API.
- `netlify/functions/chat.ts`: وظيفة المحادثة.
- `netlify/functions/generate-image.ts`: وظيفة الصور التي يُطلب إنشاؤها داخل المحادثة.
- `netlify/functions/_shared/ai.ts`: الاتصال الآمن بالمزوّد وتعريف Leon's 0.1.
- `client/`: الواجهة، اختيار اللغة حسب تفضيل الجهاز، والأنيميشن الذي أرسلته.

يعرّف التطبيق Leon's 0.1 كمساعد ذكي طوّره **Med nour idmouh ضمن Leons Lab**. هذا اسم وهوية المساعد في التطبيق؛ خدمة الاستدلال تأتي من مزوّد الـAPI الذي تضبطه، ولا يدّعي التطبيق أن النموذج الأساسي تدرّب من الصفر لدى الشركة. النسخة لا تحفظ سجل المحادثة أو الصور بشكل دائم، وقد تنتهي صلاحية بعض روابط الصور.

## روابط Netlify الرسمية

- [طرق إنشاء deploy والرفع اليدوي وCLI](https://docs.netlify.com/deploy/create-deploys/)
- [إنشاء ونشر Netlify Functions](https://docs.netlify.com/build/functions/get-started/)
- [دليل Netlify CLI](https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/)
