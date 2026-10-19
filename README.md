# Leon's AI 0.1

Web chat and image generation for Leon's AI, branded as a Leons Lab project. Image requests are handled inside the conversation; generated images appear inline. The app also includes Google sign-in, language selection based on the browser/device locale, and voice controls supported by the browser.

## Deploy with Netlify

Import this GitHub repository in Netlify. The checked-in `netlify.toml` configures the build:

- Build command: `pnpm build:static`
- Publish directory: `dist/public`
- Functions directory: `netlify/functions`

You do not need to upload the static Drop ZIP. Deploy the repository source so Netlify can bundle the chat and image Functions.

## Required Netlify environment variables

For Google sign-in and API authorization, add these values in the Netlify site settings:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `FIREBASE_PROJECT_ID` (same value as `VITE_FIREBASE_PROJECT_ID`, for Functions)
- `AI_API_BASE_URL`
- `AI_API_KEY` (secret; Functions only)
- `AI_CHAT_MODEL`
- `AI_IMAGE_MODEL`

Enable Google as a sign-in provider in Firebase Authentication and add the final Netlify domain to Firebase's authorized domains. Rebuild/redeploy after setting environment variables. See [`README_NETLIFY.md`](README_NETLIFY.md) for details.

The repository contains an `.env.example` with variable names only. Do not commit real API keys. AI provider costs and image-generation limits depend on the provider; free, unlimited image generation is not guaranteed.
