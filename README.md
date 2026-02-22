# Portfolio & Blog

Single-page portfolio + blog. 11ty, GitHub Pages, dark theme, neon orange accent.

## Setup

- `npm install` then `npm run build` or `npm run serve`
- Add your profile image as `images/hero-profile.png`
- **Favicons:** Put your 3 icons in `images/` with these exact names: `favicon.ico`, `favicon-32x32.png`, `apple-touch-icon.png` (32×32 and 180×180 are typical). Already linked in the layout.
- For resume download: add a **no-PII** PDF as `resume.pdf` in repo root (no phone/email/address). If you don’t add it, remove or comment out the resume passthrough in `.eleventy.js` and the Resume links in the theme
- **Giscus (comments):** See **`docs/GISCUS_SETUP.md`** — install the giscus app on the repo, then fill in `_data/giscus.json` with the IDs from [giscus.app](https://giscus.app)

## Security / PII

- Do not commit phone, email, or physical address. `.gitignore` excludes common resume/secret paths.
- Contact on site is Resume + LinkedIn + GitHub only (no contact form).

## Deploy

Push to `main`; GitHub Actions builds and deploys to GitHub Pages. If the site is at `https://<user>.github.io/<repo>/`, `PATH_PREFIX` and `BASE_URL` are set in the workflow.

## Spec

See `docs/BUILD_SPEC.md` and `docs/NEW_SITE_QA_SECURITY_COST_PRIVACY.md`.
