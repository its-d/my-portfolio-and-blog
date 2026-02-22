# Portfolio & Blog

Personal portfolio and blog site. Dark theme, single-page layout, blog with comments (Giscus). Built with Eleventy and deployed to GitHub Pages.

---

## Run locally

```bash
npm install
npm run serve
```

Open http://localhost:8080 (or the port shown). Use `npm run build` to only build, no server.

---

## Deploy

Push to the `main` branch. GitHub Actions builds the site and deploys it to GitHub Pages.

In the repo **Settings → Pages**, set the source to **GitHub Actions**. The site will be at `https://<username>.github.io/my-portfolio-and-blog/`.

---

## What’s in the repo

- **Home:** Hero, projects, skills, about, experience, certifications, contact (Resume + LinkedIn + GitHub only).
- **Blog:** Posts in `blog/posts/` (Markdown). Comments via Giscus (GitHub Discussions).
- **Content:** Edit `_data/site.json` for name, title, links; `_data/projects.json`, `_data/experience.json`, etc. for sections. Put profile photo at `images/hero-profile.png`, favicons in `images/` as `favicon.ico`, `favicon-32x32.png`, `apple-touch-icon.png`. Optional: add a no-PII resume as `resume.pdf` in the repo root.

Details for Giscus setup are in `docs/GISCUS_SETUP.md`.

---

## Keeping the repo safe

- Do not commit your phone number, personal email, or physical address. The only PDF allowed by `.gitignore` is `resume.pdf` in the repo root; use a version without PII.
- Do not commit `.env` files, API keys, or secrets. The workflow uses no secrets; it only builds and deploys from the repo.
- Only you (and collaborators you add) can change the repo and the deployed site. Restrict write access in **Settings → Collaborators** if needed.
