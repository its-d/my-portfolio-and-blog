# Build spec — Portfolio & Blog (v1)

Single-page portfolio + blog. 11ty, GitHub Pages, Giscus. No PII on site.

---

## Pre-launch checklist (security & privacy)

- [ ] No phone, personal email, or physical address in repo or built site
- [ ] Contact = Resume + LinkedIn + GitHub only; no contact form; no `mailto:`
- [ ] Resume PDF is no-PII version (name it `resume.pdf` in repo root if hosting)
- [ ] No secrets or API keys in committed files (use GitHub Secrets if ever needed)
- [ ] `.gitignore` excludes PII/sensitive files (resume drafts, .env, etc.)
- [ ] Giscus repo ID / mapping configured only in theme (no secrets in Giscus)

---

## Layout reference

Jaydeep-style: top nav, hero (headline + photo + CTA), quote, project cards, skills grid, about (Resume + LinkedIn), experience cards, certifications, contact (links only), footer.

---

## Nav (exact order)

**Home | About | Projects | Skills | Blog | Contact**

All anchors on home except Blog → `/blog/`.

---

## Home page sections

| Section | Content |
|--------|--------|
| **Hero** | Nav brand: "Darian". Headline (TBD one line). Sub: "AWS Platform Engineer & DevOps Consultant." CTA: "Scroll down" (or "Scroll down +"). Right: profile photo → caption "A sponge for information, learning and sharing what I build." → LinkedIn + GitHub links under photo. |
| **Quote** | "You don't have to be an expert to start. You become one by starting." Attribution: "A Daily Reminder" |
| **Projects** | Cards: image, tech tags box, project name, short description, "View repo" + "Live demo" (only when demo URL exists). Planned section for future projects. |
| **Skills** | Icon grid, flat list (reorderable via data). One icon + name per skill. |
| **About** | Two short paragraphs (who you are / focus; what you bring). CTAs: Resume (PDF link), Connect on LinkedIn. |
| **Experience** | Card per role. Four roles: Independent Consulting, AWS, GDIT, SCLogic. Company, title, dates, 2–4 bullets from resume only. |
| **Certifications** | All 8 with logos where possible: AWS DevOps Pro, AWS AI Practitioner, SysOps, Developer, Cloud Practitioner, Security+, Terraform Associate, Azure Fundamentals. |
| **Contact** | Resume + LinkedIn + GitHub only. No form, no "Open to new opportunities" line unless you add later. |
| **Footer** | "© 2026. Made by Darian." (year dynamic) + LinkedIn and GitHub icons. |

---

## Blog

- **URL:** `/blog/` (index), `/blog/posts/slug/` (posts).
- **Features:** Share buttons (X, LinkedIn, etc.); Giscus comments (GitHub Discussions); you moderate in GitHub.
- **Contact at bottom of post/blog:** Same as home — LinkedIn, GitHub (no form).

---

## Design

- **Background:** Dark (e.g. #0a0a0a / #0f1419).
- **Body text:** Light gray / off-white.
- **Accent:** Neon orange (#f26722, nudge brighter if needed); cyberpunk-inspired.
- **Decorative:** Subtle, aesthetic accents (thin lines / light geometric); not dominant.

---

## Tech

- **Build:** 11ty; Markdown for posts; Nunjucks layouts.
- **Deploy:** GitHub Actions → GitHub Pages. No custom domain required for v1.
- **Comments:** Giscus (no extra storage).
- **Favicons:** You provide 3 sizes; add to repo and reference in `<head>`.

---

## Content sources (no fabrication)

- **Experience & certs:** From `darian_lee_resume_2026_NO_PHONE.pdf` only.
- **Resume download:** Use a no-PII PDF as `resume.pdf` (no email/phone/address on public version).

---

## Repo / .gitignore

- Ignore: `node_modules/`, `_site/`, `*.pdf` (except explicit `resume.pdf` if you add it), `resume-*.pdf`, `**/darian_lee*.pdf`, `.env`, `secrets/`, OS/editor files.
- Do not commit: any file containing phone, email, or physical address.
