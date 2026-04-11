# Portfolio Revamp Implementation Plan

> **For Claude:** Use /executing-plans to implement this plan task-by-task.

**Goal:** Rewrite the home page (and shared chrome) of `its-d.github.io` per the design doc — Mikon-style hero, engineering-coded accents, new sections (case studies, testimonial, currently building), restyled chrome (nav CTA, 3-column footer), and global color/font system updates.

**Architecture:** Eleventy 2.x static site, Nunjucks partials, vanilla CSS, JSON data files. No JS framework, no build pipeline beyond Eleventy. All section rendering is data-driven from `_data/*.json` → `_includes/partials/*.njk` → `index.njk`. We do data updates first, then per-section partial+CSS work in IA order, then wire it all up in `index.njk`, then optimize and QA.

**Tech Stack:** Eleventy 3.x · Nunjucks · vanilla CSS (custom properties + grid + flexbox) · GitHub Pages · Giscus (blog only, untouched) · ImageMagick or `sharp` CLI for hero photo optimization

**Companion design doc:** [`docs/plans/2026-04-11-portfolio-revamp-design.md`](2026-04-11-portfolio-revamp-design.md). Read it before starting any task — it contains the rationale, copy text, and visual specs that this plan does not repeat.

---

## Verification model (no test framework)

This is a static site with **no test framework**. Standard "write failing test → implement → pass" flow does not apply. Instead, every task uses this verification pattern:

1. **Build check** — run `npm run build` and confirm exit code 0, no template errors
2. **Visual check** — run `npm start` (which launches `eleventy --serve` on http://localhost:8080), open the page, scroll to the affected section, confirm it renders correctly
3. **Console check** — open browser devtools, confirm zero JS errors and zero broken-image 404s in the Network tab
4. **Mobile check** — toggle devtools responsive mode at ~375px width, confirm layout doesn't break

**If the dev server is already running** from a prior task, Eleventy will hot-reload — no need to restart. Only restart if data file changes don't propagate (rare).

**Commit after every task.** Frequent commits make rollback easy if a later task breaks an earlier one.

---

## Branch & worktree setup

This plan should be executed on a feature branch. The recommended setup:

```bash
git checkout -b portfolio-revamp
```

(A worktree is overkill for a static-site rewrite that doesn't block other work.)

---

## Task list overview

**Phase 0 — Setup**
- Task 0.1: Add `.gitignore` rules for source photos
- Task 0.2: Smoke-test the existing build

**Phase 1 — Foundation (CSS variables, mono font, base utilities)**
- Task 1.1: Update accent color variable site-wide
- Task 1.2: Add monospace font stack variable
- Task 1.3: Add `.pill` mono pill component class
- Task 1.4: Add command-prompt eyebrow `.eyebrow-cmd` and comment eyebrow `.eyebrow-com` utility classes

**Phase 2 — Data updates (no rendering changes yet)**
- Task 2.1: Replace `_data/planned.json` with new 3-item Currently Building data
- Task 2.2: Add `featured` flag to `_data/experience.json`
- Task 2.3: Reorder `_data/skills.json`
- Task 2.4: Convert `_data/certifications.json` to object array with badge image + Credly URL fields
- Task 2.5: Create `_data/caseStudies.json` (new file, 4 placeholder entries)
- Task 2.6: Create `_data/testimonial.json` (new file)

**Phase 3 — Per-section partial + CSS work (in IA order)**
- Task 3.1: Footer — add motto, swap "Categories" column for "Latest Writing" on home, add `> whoami` bottom-bar echo
- Task 3.2: Nav — add `[ Let's Talk → ]` CTA pill
- Task 3.3: Hero — full rewrite (split-screen layout, photo, typewriter, stat strip, vertical text, floating icons)
- Task 3.4: Projects — mono pill tech tags, add case-study link slot, remove planned block, add `> ls more →` link
- Task 3.5: Case Studies — new partial + CSS (placeholder cards)
- Task 3.6: Testimonial — new partial + CSS (pull-quote callout)
- Task 3.7: About — copy update, eyebrow add
- Task 3.8: Experience — featured/compact tier rendering + CSS
- Task 3.9: Skills — reordered grid, category labels, eyebrow add
- Task 3.10: Certifications — badge wall partial + CSS (renders placeholders if badge images missing)
- Task 3.11: Currently Building — rename partial, distinct WIP card styling, status pills
- Task 3.12: Contact — restyle buttons, add eyebrow + sub-line

**Phase 4 — Page wire-up**
- Task 4.1: Update `index.njk` — new include order, remove `quote`, switch to full footer

**Phase 5 — Image assets**
- Task 5.1: Optimize hero photo to web size, place in `images/self/hero-darian.png`
- Task 5.2: Add cert badge placeholder generator OR scaffold for Darian to drop in real Credly badges later
- Task 5.3: Update `_data/site.json` if needed (version-bump year, etc.)

**Phase 6 — QA & polish**
- Task 6.1: Lighthouse pass — performance, accessibility, best practices
- Task 6.2: Mobile responsive sweep at 375px / 768px / 1024px / 1440px
- Task 6.3: Reduced-motion verification
- Task 6.4: Cross-page footer parity check (home vs blog vs blog post)
- Task 6.5: Final commit + merge prep

---

## Phase 0 — Setup

### Task 0.1: Add `.gitignore` rules for source photos

**Why:** The 16 MB original PNG and 7–9 MB original JPGs in `images/self/` are too large to commit. We keep them locally as the source archive but must keep them out of git.

**Files:**
- Modify: `.gitignore`

**Step 1:** Read current `.gitignore`.

```bash
cat .gitignore
```

**Step 2:** Append photo source rules. Use Edit tool to add at the end:

```
# Source photo originals — too large to commit; only optimized web versions go in /images/self/
images/self/IMG_*.jpg
images/self/IMG_*.png
images/self/*_wout_background.png
!images/self/hero-darian.png
```

**Step 3:** Verify the originals are now ignored:

```bash
git status --ignored images/self/
```

Expected: Lists `IMG_2287_wout_background.png` (and any other `IMG_*` files) under "Ignored files."

**Step 4:** Commit.

```bash
git add .gitignore
git commit -m "ignore source photo originals in images/self/"
```

---

### Task 0.2: Smoke-test the existing build

**Why:** Confirm the existing site builds cleanly *before* changes, so any later breakage is unambiguously ours.

**Step 1:** Install dependencies (idempotent).

```bash
npm install
```

Expected: completes without errors.

**Step 2:** Run a one-shot build.

```bash
npm run build
```

Expected: exit code 0, output written to `_site/`, no template errors. If this fails, **stop and investigate** — do not proceed with the revamp on a broken baseline.

**Step 3:** Start the dev server in the background and confirm it serves the home page.

```bash
npm start
```

Open http://localhost:8080 in a browser. Confirm the existing site renders. **Leave the dev server running** for the rest of the implementation — Eleventy will hot-reload as files change.

**Step 4:** No commit (read-only smoke test).

---

## Phase 1 — Foundation

These four tasks add the building blocks every later task uses. Do them in order — each one is small and the later sections depend on them.

### Task 1.1: Update accent color variable

**Files:**
- Modify: `css/style.css:1-13` (the `:root` block)

**Step 1:** Open `css/style.css` and locate the `:root` block. Replace the accent color values:

```css
:root {
  --bg: #000000;
  --bg-soft: #1a1a1a;
  --text: #ffffff;
  --text-muted: #9ca3af;
  --accent: #f26722;            /* was #ef3924 */
  --accent-glow: #ff8a4d;       /* was #f05a4a */
  --accent-pink: #f26722;       /* was #ef3924 — used as alias; align */
  --border: rgba(242, 103, 34, 0.25);   /* was rgba(239, 57, 36, 0.25) */
  --card-bg: #1a1a1a;
  --image-frame: rgba(242, 103, 34, 0.1); /* was rgba(239, 57, 36, 0.1) */
}
```

**Step 2:** Search the rest of `css/style.css` for any **hard-coded** `#ef3924` or `rgba(239, 57, 36, ...)` values that don't go through the variable. Replace each with the new value or the variable.

Use Grep to find them:

```
Grep pattern: "#ef3924|239,\s*57,\s*36"
```

Replace each occurrence with `#f26722` or `rgba(242, 103, 34, ALPHA)` or — better — the appropriate CSS variable.

**Step 3:** Verify in browser. The dev server should hot-reload. Visit `http://localhost:8080` — every previously-red accent (links, buttons, borders, section titles) should now be the new orange.

**Step 4:** Commit.

```bash
git add css/style.css
git commit -m "swap accent color #ef3924 → #f26722 sitewide"
```

---

### Task 1.2: Add monospace font stack variable

**Files:**
- Modify: `css/style.css` (`:root` block)

**Step 1:** Add a new CSS variable in the `:root` block immediately after `--image-frame`:

```css
  --font-mono: ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
```

**Step 2:** No visual change yet — the variable exists but isn't applied anywhere. Build check only:

```bash
npm run build
```

Expected: exit code 0.

**Step 3:** Commit.

```bash
git add css/style.css
git commit -m "add --font-mono CSS variable for accent labels"
```

---

### Task 1.3: Add `.pill` mono pill component class

**Why:** Reusable across hero typewriter container, hero CTA, project tech tags, status badges, and the hero "automation" floating icon. One class, many uses.

**Files:**
- Modify: `css/style.css` (add new section after the `.btn` block, before `/* Hero */`)

**Step 1:** Add this CSS block after the existing `.btn-outline:hover` rule:

```css
/* Mono pill component — bracketed monospace badges, used everywhere */
.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  padding: 0.35rem 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--accent);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 6px;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.pill::before {
  content: "[";
  color: var(--text-muted);
}

.pill::after {
  content: "]";
  color: var(--text-muted);
}

.pill-filled {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.pill-filled::before,
.pill-filled::after {
  color: rgba(255, 255, 255, 0.6);
}

.pill-dashed {
  border-style: dashed;
}

.pill:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px rgba(242, 103, 34, 0.2);
  transform: translateY(-1px);
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
```

**Step 2:** Build check:

```bash
npm run build
```

Expected: exit 0. No visual change yet — nothing renders `.pill` on the page until later tasks.

**Step 3:** Commit.

```bash
git add css/style.css
git commit -m "add .pill mono pill component class"
```

---

### Task 1.4: Add eyebrow utility classes

**Why:** Standardize the `> command` and `// comment` accents the design uses on every section.

**Files:**
- Modify: `css/style.css` (add after `.pill` block)

**Step 1:** Add this CSS:

```css
/* Eyebrow accents — small mono labels above section titles or hero elements */
.eyebrow {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0 0 0.5rem;
  letter-spacing: 0.02em;
}

.eyebrow-cmd::before {
  content: "> ";
  color: var(--accent);
}

.eyebrow-com::before {
  content: "// ";
  color: var(--accent);
}
```

**Step 2:** Build check:

```bash
npm run build
```

Expected: exit 0. No visual change yet.

**Step 3:** Commit.

```bash
git add css/style.css
git commit -m "add .eyebrow utility classes for cmd/comment accents"
```

---

## Phase 2 — Data updates

These tasks update or create JSON files. **No partials are touched yet** — partials are updated in Phase 3 to consume the new data shapes. Build will continue to render the *old* partials with the *new* data, which means temporarily some sections may render oddly until their Phase 3 task lands. That's expected.

### Task 2.1: Replace `_data/planned.json` with Currently Building data

**Files:**
- Modify: `_data/planned.json`

**Step 1:** Replace the file contents with:

```json
[
  {
    "name": "ai-interview-prep",
    "description": "An AI-powered tool that turns any job description into a personalized study plan, flashcards, and practice questions — so candidates walk into interviews fully prepared.",
    "status": "in-dev"
  },
  {
    "name": "iac-to-diagram",
    "description": "Paste Terraform, CDK, or CloudFormation and get an interactive architecture diagram out. Generates accurate visual representations so engineers skip manual diagramming and stakeholders always have up-to-date docs.",
    "status": "planning"
  },
  {
    "name": "daily-feed",
    "description": "A topic-organized RSS aggregator designed to live as a browser homepage. Pull feeds from across tech, news, and personal interests into one daily reading view.",
    "status": "planning"
  }
]
```

**Step 2:** Build check.

```bash
npm run build
```

Expected: exit 0. The existing `projects.njk` partial renders the planned block as `name — description` bullet items; the `status` field is silently ignored until Task 3.11 introduces the new partial. That's fine.

**Step 3:** Commit.

```bash
git add _data/planned.json
git commit -m "replace planned.json with 3 currently-building items + status field"
```

---

### Task 2.2: Add `featured` flag to `_data/experience.json`

**Files:**
- Modify: `_data/experience.json`

**Step 1:** Open the file and add `"featured": true` to the first two objects (Independent Consulting, Amazon Web Services) and `"featured": false` to the last two (GDIT, SCLogic). Place the field after `"location"` for consistency.

Example for the first entry:

```json
{
  "company": "Independent Consulting",
  "title": "Contractor",
  "dates": "August 2025 – Present",
  "location": "Remote",
  "featured": true,
  "bullets": [...]
}
```

**Step 2:** Build check (`npm run build`). The existing `experience.njk` ignores the new field — no visual change yet.

**Step 3:** Commit.

```bash
git add _data/experience.json
git commit -m "add featured flag to experience entries"
```

---

### Task 2.3: Reorder `_data/skills.json`

**Files:**
- Modify: `_data/skills.json`

**Step 1:** Replace the file contents with the new order (cloud → iac → languages → runtime → os → vcs → ci → observability → data → practices):

```json
[
  { "name": "AWS", "icon": "/images/blog/skills/aws.png" },
  { "name": "Terraform", "icon": "/images/blog/skills/terraform.jpg" },
  { "name": "Python", "icon": "/images/blog/skills/python.png" },
  { "name": "Docker", "icon": "/images/blog/skills/docker.jpg" },
  { "name": "Linux", "icon": "/images/blog/skills/linux.jpg" },
  { "name": "GitHub", "icon": "/images/blog/skills/github.jpg" },
  { "name": "GitLab", "icon": "/images/blog/skills/gitlab.jpg" },
  { "name": "Grafana", "icon": "/images/blog/skills/grafana.jpg" },
  { "name": "SQL", "icon": "/images/blog/skills/sql.jpg" },
  { "name": "Agile", "icon": "/images/blog/skills/agile.png" }
]
```

**Step 2:** Visual check at `http://localhost:8080#skills` — the grid should now show AWS first and the order should match the new sequence. (Existing partial still renders, just in a new order.)

**Step 3:** Commit.

```bash
git add _data/skills.json
git commit -m "reorder skills.json by relevance (aws first, agile last)"
```

---

### Task 2.4: Convert `_data/certifications.json` to object array

**Files:**
- Modify: `_data/certifications.json`

**Step 1:** Replace the file with object entries. The `image` paths are placeholders pointing to a folder we haven't populated yet — that's intentional. Task 3.10 will handle missing-image fallback rendering.

```json
[
  {
    "name": "AWS Certified DevOps Engineer – Professional",
    "shortName": "DevOps Pro",
    "image": "/images/certs/aws-devops-pro.png",
    "credlyUrl": ""
  },
  {
    "name": "AWS Certified SysOps Administrator",
    "shortName": "SysOps Admin",
    "image": "/images/certs/aws-sysops.png",
    "credlyUrl": ""
  },
  {
    "name": "AWS Certified Developer",
    "shortName": "Developer",
    "image": "/images/certs/aws-developer.png",
    "credlyUrl": ""
  },
  {
    "name": "AWS Certified Cloud Practitioner",
    "shortName": "Cloud Practitioner",
    "image": "/images/certs/aws-ccp.png",
    "credlyUrl": ""
  },
  {
    "name": "AWS Certified AI Practitioner",
    "shortName": "AI Practitioner",
    "image": "/images/certs/aws-ai.png",
    "credlyUrl": ""
  },
  {
    "name": "CompTIA Security+",
    "shortName": "Security+",
    "image": "/images/certs/comptia-secplus.png",
    "credlyUrl": ""
  },
  {
    "name": "HashiCorp Terraform Associate",
    "shortName": "Terraform Associate",
    "image": "/images/certs/hashicorp-tf.png",
    "credlyUrl": ""
  },
  {
    "name": "Microsoft Azure Fundamentals (AZ-900)",
    "shortName": "Azure Fundamentals",
    "image": "/images/certs/msft-az900.png",
    "credlyUrl": ""
  }
]
```

**Step 2:** **Expect the existing `certifications.njk` to break visually** — it iterates `cert` as a string and renders `{{ cert }}` inside `.cert-name`, which now produces `[object Object]`. Build will still succeed; the visual is broken until Task 3.10. That's acceptable for ~30 minutes of plan time.

```bash
npm run build
```

Expected: exit 0 (Nunjucks doesn't throw on object-as-string coercion).

**Step 3:** Commit.

```bash
git add _data/certifications.json
git commit -m "convert certifications.json to object array (name, image, credlyUrl)"
```

---

### Task 2.5: Create `_data/caseStudies.json`

**Files:**
- Create: `_data/caseStudies.json`

**Step 1:** Create the new file with 4 placeholder entries:

```json
[
  {
    "title": "Stopping WooCommerce Checkout Bots at the Edge",
    "summary": "How I traced a Cloudflare Turnstile misconfig back to the edge layer and shipped a zero-fraud fix.",
    "status": "coming-soon",
    "slug": null
  },
  {
    "title": "iac-to-diagram: From IaC Text to Interactive Architecture",
    "summary": "Building a tool that turns Terraform, CDK, and CloudFormation into accurate diagrams nobody has to redraw.",
    "status": "coming-soon",
    "slug": null
  },
  {
    "title": "AI-Powered Interview Prep: Personal Plans from Job Descriptions",
    "summary": "Generating day-by-day study plans, flashcards, and practice questions from any job posting.",
    "status": "coming-soon",
    "slug": null
  },
  {
    "title": "daily-feed: A Topic-Organized RSS Browser Homepage",
    "summary": "One reading view for tech, news, and personal interests — pulled from feeds, organized by topic.",
    "status": "coming-soon",
    "slug": null
  }
]
```

**Step 2:** Build check.

```bash
npm run build
```

Expected: exit 0. Nothing renders this data yet.

**Step 3:** Commit.

```bash
git add _data/caseStudies.json
git commit -m "add caseStudies.json with 4 placeholder entries"
```

---

### Task 2.6: Create `_data/testimonial.json`

**Files:**
- Create: `_data/testimonial.json`

**Step 1:** Create the file:

```json
{
  "pullQuote": "His thorough explanations and responsive communication style enabled us to make the best decisions for our website. He came in with the needed repairs on time and on budget.",
  "fullQuote": "The Swedish American Historical Society is a small organization, and one that does not typically run into IT trouble. However, when we encountered an issue that our team could not resolve independently, Darian stepped in to help. His thorough explanations and responsive communication style enabled us to make the best decisions for our website. He came in with the needed repairs on time and on budget, and he was available for additional questions and service when asked to do so.",
  "name": "Aubrey",
  "role": "Project Manager",
  "org": "Swedish American Historical Society"
}
```

**Step 2:** Build check.

```bash
npm run build
```

Expected: exit 0.

**Step 3:** Commit.

```bash
git add _data/testimonial.json
git commit -m "add testimonial.json with SAHS pull-quote and attribution"
```

---

## Phase 3 — Per-section partial + CSS work

We work in IA order, except we **start with the footer and nav** because they're shared chrome that affects every page. Then we tackle the home-page sections in IA order.

### Task 3.1: Footer — motto, latest writing column, bottom-bar echo

**Why:** The blog page already uses `footer.njk` (the 3-column version), but the home page uses an inline `<footer>` in `index.njk`. We want one footer for both. We also need to (a) add the relocated motto to column 1, (b) introduce a "Latest Writing" column on home (keeping "Categories" on blog via conditional), and (c) add the `> whoami` echo to the bottom bar.

**Files:**
- Modify: `_includes/partials/footer.njk`
- Modify: `css/style.css` (add motto + latest-writing styles)

**Step 1:** Replace the contents of `_includes/partials/footer.njk` with this template. The conditional `{% if page.url == '/blog/' or '/blog/posts/' in page.url %}` switches column 2 between "Categories" (blog/posts) and "Latest Writing" (home).

```njk
<footer class="site-footer site-footer-columns">
  <div class="footer-inner">
    <div class="footer-col footer-about">
      <p class="footer-motto">
        Always Building.<br>
        Always Learning.<br>
        Always Sharing.
      </p>
      <p class="footer-about-text">{{ site.authorBioFooter }}</p>
      <a href="{{ site.github }}" target="_blank" rel="noopener noreferrer" class="btn btn-outline footer-github">Follow on GitHub</a>
    </div>

    {% set isBlogContext = page.url == '/blog/' or '/blog/posts/' in page.url %}
    {% if isBlogContext %}
    <div class="footer-col footer-categories">
      <h3 class="footer-col-title eyebrow eyebrow-com">categories</h3>
      <ul class="footer-cat-list">
        {% for cat in collections.categories %}
        <li><a href="{{ '/blog/' | url }}?category={{ cat | urlencode }}">{{ cat | categoryLabel }}</a></li>
        {% endfor %}
      </ul>
    </div>
    {% else %}
    <div class="footer-col footer-latest">
      <h3 class="footer-col-title eyebrow eyebrow-com">latest writing</h3>
      <ul class="footer-latest-list">
        {% for post in collections.posts | reverse | slice(2) | first %}
        <li>
          <a href="{{ post.url | url }}">{{ post.data.title }}</a>
          <span class="footer-latest-date">{{ post.date | date('MMM d, yyyy') }}</span>
        </li>
        {% endfor %}
      </ul>
      <a href="{{ '/blog/' | url }}" class="footer-latest-all">View all posts →</a>
    </div>
    {% endif %}

    <div class="footer-col footer-links">
      <h3 class="footer-col-title eyebrow eyebrow-com">quick links</h3>
      <ul class="footer-links-list">
        <li><a href="{{ '/' | url }}">Home</a></li>
        <li><a href="{{ '/' | url }}#projects">Projects</a></li>
        <li><a href="{{ '/blog/' | url }}">Blog</a></li>
        <li><a href="{{ '/' | url }}#about">About</a></li>
        <li><a href="{{ '/' | url }}#contact">Contact</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p class="footer-copy">© {{ site.year }}. Made by {{ site.name }}.</p>
    <p class="footer-whoami eyebrow eyebrow-cmd">whoami · {{ site.authorFullName }}</p>
  </div>
</footer>
```

**Note on the `slice` filter:** Eleventy uses Nunjucks built-ins. The expression `collections.posts | reverse | slice(2) | first` is **incorrect** — Nunjucks `slice` returns chunks of N. Use a different approach:

Replace the post-iteration block with:

```njk
        {% set recentPosts = collections.posts | reverse %}
        {% for post in recentPosts %}
          {% if loop.index <= 2 %}
          <li>
            <a href="{{ post.url | url }}">{{ post.data.title }}</a>
            <span class="footer-latest-date">{{ post.date | date('MMM d, yyyy') }}</span>
          </li>
          {% endif %}
        {% endfor %}
```

(Note: `collections.posts` is already reversed by the existing `addCollection` in `.eleventy.js`, so the extra `| reverse` may be unnecessary. Verify by inspecting `_site/index.html` after build — if the most recent post appears first in the footer list, drop the `| reverse`. Otherwise keep it.)

**Step 2:** Add new footer styles in `css/style.css` after the existing `.footer-copy` block:

```css
/* Footer — motto + latest writing column */
.footer-motto {
  margin: 0 0 1rem;
  font-family: var(--font-mono);
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.4;
  color: var(--accent);
}

.footer-latest-list {
  list-style: none;
  margin: 0 0 0.75rem;
  padding: 0;
}

.footer-latest-list li {
  margin-bottom: 0.6rem;
  font-size: 0.9rem;
  line-height: 1.35;
}

.footer-latest-list a {
  color: var(--text-muted);
  display: block;
}

.footer-latest-list a:hover {
  color: var(--accent);
}

.footer-latest-date {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  opacity: 0.7;
  margin-top: 0.15rem;
}

.footer-latest-all {
  font-family: var(--font-mono);
  font-size: 0.85rem;
}

/* Footer bottom-bar layout (was single-column, now needs whoami right) */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.footer-whoami {
  margin: 0;
  font-size: 0.8rem;
}

@media (max-width: 600px) {
  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
```

**Step 3:** Visual check on `/blog/` — should still show Categories column (because we conditional on blog context). Visual check on `/` — currently the home page uses the inline minimal footer in `index.njk`, so this won't show on home YET. That's fixed in Task 4.1.

**Step 4:** Build check.

```bash
npm run build
```

Expected: exit 0, no template errors.

**Step 5:** Commit.

```bash
git add _includes/partials/footer.njk css/style.css
git commit -m "footer: add motto, latest writing column, whoami bottom bar"
```

---

### Task 3.2: Nav — add `[ Let's Talk → ]` CTA

**Files:**
- Modify: `_includes/partials/nav.njk`
- Modify: `css/style.css` (add `.nav-cta` styles)

**Step 1:** Replace the contents of `_includes/partials/nav.njk`:

```njk
<header class="site-header">
  <nav class="nav" aria-label="Main">
    <a href="{{ '/' | url }}" class="nav-brand">{{ site.name }}</a>
    <ul class="nav-links">
      <li><a href="{{ '/' | url }}#projects">Projects</a></li>
      <li><a href="{{ '/blog/' | url }}">Blog</a></li>
      <li><a href="{{ '/' | url }}#about">About</a></li>
      <li><a href="{{ '/' | url }}#contact">Contact</a></li>
    </ul>
    <a href="{{ '/' | url }}#contact" class="nav-cta">Let's Talk →</a>
  </nav>
</header>
```

Notes on changes vs. existing:
- Removed `About` from nav-links order and re-added after Blog (matches updated IA where About comes later)
- Removed `Skills` from primary nav (it's still scrollable on the page; primary nav doesn't need to advertise it)
- Added the right-aligned `Let's Talk →` CTA

**Step 2:** Add CSS for `.nav-cta` after the `.nav-links` block in `css/style.css`:

```css
.nav-cta {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  background: var(--accent);
  border: 1px solid var(--accent);
  border-radius: 6px;
  transition: background 0.2s, transform 0.2s;
}

.nav-cta:hover {
  background: var(--accent-glow);
  color: #fff;
  transform: translateY(-1px);
}

@media (max-width: 600px) {
  .nav-links {
    display: none;
  }
}
```

**Step 3:** Visual check at `http://localhost:8080`:
- Nav should have the orange `Let's Talk →` button on the far right
- Click it — should smooth-scroll to `#contact` (the existing `html { scroll-behavior: smooth }` rule handles this)

**Step 4:** Commit.

```bash
git add _includes/partials/nav.njk css/style.css
git commit -m "nav: add Let's Talk CTA, reorder primary links"
```

---

### Task 3.3: Hero — full rewrite

**This is the biggest task in the plan. ~30–45 minutes.**

**Files:**
- Modify: `_includes/partials/hero.njk` (full replacement)
- Modify: `css/style.css` (add hero, typewriter, stat strip, vertical text styles)
- Reference: `_data/site.json` (no change required, but the partial reads from it)

**Step 1:** Replace `_includes/partials/hero.njk` entirely:

```njk
<section class="hero" id="home">
  <div class="hero-grid">

    <div class="hero-left">
      <p class="hero-eyebrow eyebrow eyebrow-cmd">whoami</p>

      <h1 class="hero-headline">I'm Darian.</h1>

      <div class="hero-tagline" aria-label="What I do">
        <span class="pill hero-tagline-pill">
          <span class="hero-typewriter" aria-hidden="true"></span>
          <span class="hero-typewriter-cursor" aria-hidden="true">_</span>
        </span>
        <span class="visually-hidden">I develop cloud infrastructure, automate DevOps, ship AWS systems, and build agentic AI tools.</span>
      </div>

      <a href="#contact" class="btn btn-primary hero-cta">Get in touch →</a>

      <ul class="hero-stats">
        <li class="hero-stat">
          <span class="hero-stat-num">8<span class="hero-stat-plus">+</span></span>
          <span class="hero-stat-label">Years<br>Building</span>
        </li>
        <li class="hero-stat">
          <span class="hero-stat-num">4,400<span class="hero-stat-plus">+</span></span>
          <span class="hero-stat-label">Engineers<br>Reached</span>
        </li>
        <li class="hero-stat">
          <span class="hero-stat-num">8</span>
          <span class="hero-stat-label">Certifications</span>
        </li>
      </ul>
    </div>

    <div class="hero-right">
      <div class="hero-photo-block">
        <img
          src="{{ '/images/self/hero-darian.png' | url | absoluteUrl }}"
          alt="{{ site.authorFullName }}"
          class="hero-photo"
          width="600"
          height="400"
        >
        <span class="hero-vertical">// MY · STACK ·</span>
        <ul class="hero-stack-icons" aria-label="My stack">
          <li><img src="{{ '/images/blog/skills/aws.png' | url | absoluteUrl }}" alt="AWS"></li>
          <li><img src="{{ '/images/blog/skills/terraform.jpg' | url | absoluteUrl }}" alt="Terraform"></li>
          <li><img src="{{ '/images/blog/skills/python.png' | url | absoluteUrl }}" alt="Python"></li>
          <li><span class="pill hero-stack-pill">automation</span></li>
        </ul>
      </div>
    </div>

  </div>
</section>
```

**Step 2:** Replace the existing `.hero` CSS block (and everything `.hero-*` related) in `css/style.css` with the new hero layout. Locate the existing `/* Hero */` section and **replace it entirely** with:

```css
/* ============================================================
   Hero — split-screen, dark left + orange right
   ============================================================ */

.hero {
  padding: 0;
  max-width: none;
  margin: 0;
  border-bottom: 1px solid var(--border);
}

.hero-grid {
  display: grid;
  grid-template-columns: 55fr 45fr;
  min-height: 75vh;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 900px) {
  .hero-grid {
    grid-template-columns: 1fr;
    min-height: auto;
  }
}

/* --- Left half --- */
.hero-left {
  background: var(--bg);
  padding: 4rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@media (max-width: 600px) {
  .hero-left {
    padding: 3rem 1.5rem;
  }
}

.hero-eyebrow {
  margin: 0 0 1rem;
}

.hero-headline {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  line-height: 1.05;
  margin: 0 0 1.5rem;
  color: var(--text);
  letter-spacing: -0.02em;
}

.hero-tagline {
  margin: 0 0 2rem;
}

.hero-tagline-pill {
  font-size: 0.95rem;
  padding: 0.6rem 1rem;
}

.hero-typewriter {
  display: inline-block;
  min-width: 1ch;
}

.hero-typewriter-cursor {
  display: inline-block;
  margin-left: 0.1ch;
  animation: typewriter-blink 1s step-end infinite;
}

@keyframes typewriter-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.hero-cta {
  align-self: flex-start;
  font-family: var(--font-mono);
  margin-bottom: 3rem;
}

/* --- Stat strip --- */
.hero-stats {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 2.5rem;
  align-items: start;
}

@media (max-width: 600px) {
  .hero-stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
}

.hero-stat {
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border);
  padding-left: 1rem;
}

.hero-stat:first-child {
  border-left: none;
  padding-left: 0;
}

.hero-stat-num {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 800;
  color: var(--text);
  line-height: 1;
}

.hero-stat-plus {
  color: var(--accent);
  margin-left: 0.05em;
}

.hero-stat-label {
  font-size: 0.8rem;
  font-family: var(--font-mono);
  color: var(--text-muted);
  margin-top: 0.5rem;
  line-height: 1.25;
  text-transform: lowercase;
}

/* --- Right half — orange block --- */
.hero-right {
  background: var(--accent);
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  min-height: 400px;
}

.hero-photo-block {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.hero-photo {
  display: block;
  width: auto;
  max-width: 90%;
  max-height: 110%;       /* allows the head to extend above the block top */
  object-fit: contain;
  margin-top: -10%;       /* visually pushes head above the orange block */
  position: relative;
  z-index: 2;
}

@media (max-width: 900px) {
  .hero-photo {
    max-height: 60vh;
    margin-top: 0;
  }
}

/* Vertical accent text on the right edge */
.hero-vertical {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%) rotate(90deg);
  transform-origin: center;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.3em;
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
  z-index: 3;
}

/* Floating stack icons on the right edge */
.hero-stack-icons {
  position: absolute;
  right: 3rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
  z-index: 3;
}

.hero-stack-icons li {
  width: 36px;
  height: 36px;
  background: rgba(0, 0, 0, 0.85);
  border-radius: 8px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-stack-icons li img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.hero-stack-pill {
  font-size: 0.6rem !important;
  padding: 0.2rem 0.4rem !important;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.3);
}

@media (max-width: 900px) {
  .hero-vertical,
  .hero-stack-icons {
    display: none;
  }
}

/* Visually-hidden helper for screen-reader-only text */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

**Step 3:** Add the typewriter JS to `js/main.js`. The CSS handles the cursor blink; the role rotation needs JS (purely DOM-driven, no framework). Append to the existing `js/main.js` file:

```javascript
/* Hero typewriter — cycles through roles, respects reduced-motion */
(function () {
  const target = document.querySelector('.hero-typewriter');
  if (!target) return;

  const roles = [
    'I develop cloud infra',
    'I automate DevOps',
    'I ship AWS systems',
    'I build agentic AI tools'
  ];

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    target.textContent = roles[0];
    return;
  }

  const TYPE_MS = 60;
  const ERASE_MS = 30;
  const HOLD_MS = 2200;
  let roleIdx = 0;
  let charIdx = 0;
  let erasing = false;

  function tick() {
    const role = roles[roleIdx];
    if (!erasing) {
      charIdx++;
      target.textContent = role.slice(0, charIdx);
      if (charIdx === role.length) {
        erasing = true;
        return setTimeout(tick, HOLD_MS);
      }
      return setTimeout(tick, TYPE_MS);
    } else {
      charIdx--;
      target.textContent = role.slice(0, charIdx);
      if (charIdx === 0) {
        erasing = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
      return setTimeout(tick, ERASE_MS);
    }
  }

  tick();
})();
```

**Note:** the hero photo file doesn't exist yet at `/images/self/hero-darian.png` — Task 5.1 creates it. Until then, the `<img>` will 404 in the browser. That's expected; we'll fix it in Phase 5. For now, the layout will render with a broken image icon on the right side, which is fine for verification.

**Step 4:** Visual check at `http://localhost:8080`:
- Hero should be split-screen, dark left + orange right
- Headline `I'm Darian.` huge and white
- `> whoami` eyebrow above it
- Pill with cycling typewriter text and blinking cursor
- 3 stats below the CTA
- Right side: orange block with broken image icon (expected), vertical `// MY · STACK ·` text rotated, 4 floating stack icons on the right edge

**Step 5:** Build check (`npm run build`). Expected: exit 0.

**Step 6:** Commit.

```bash
git add _includes/partials/hero.njk css/style.css js/main.js
git commit -m "hero: split-screen rewrite with typewriter, stat strip, photo block"
```

---

### Task 3.4: Projects — mono pill tech tags, case-study slot, remove planned

**Files:**
- Modify: `_includes/partials/projects.njk`
- Modify: `css/style.css` (project card style updates)

**Step 1:** Replace `_includes/partials/projects.njk`:

```njk
<section class="projects" id="projects">
  <div class="section-head">
    <h2 class="section-title">#projects</h2>
    <p class="eyebrow eyebrow-com">shipped</p>
  </div>

  <div class="project-grid">
    {% for project in projects %}
    <article class="project-card">
      <div class="project-image-wrap">
        <img src="{{ project.image | url | absoluteUrl }}" alt="" class="project-image" width="400" height="220">
      </div>
      <ul class="project-tech">
        {% for tag in project.tech %}
        <li class="pill project-tech-pill">{{ tag | lower }}</li>
        {% endfor %}
      </ul>
      <h3 class="project-name">{{ project.name }}</h3>
      <p class="project-desc">{{ project.description }}</p>
      <div class="project-links">
        {% if project.repoUrl %}<a href="{{ project.repoUrl }}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">View repo →</a>{% endif %}
        {% if project.caseStudyUrl %}<a href="{{ project.caseStudyUrl }}" class="btn btn-outline">Read case study →</a>{% endif %}
      </div>
    </article>
    {% endfor %}
  </div>

  <p class="projects-more eyebrow eyebrow-cmd">
    <a href="{{ site.github }}" target="_blank" rel="noopener noreferrer">ls more →</a>
  </p>
</section>
```

Note: the **planned block is removed** from this partial. It moves to its own section in Task 3.11.

**Step 2:** Update CSS — find the existing `.project-tech` rule and replace it with the list-of-pills version:

```css
.project-tech {
  list-style: none;
  margin: 0.75rem 1rem 0.5rem;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.project-tech-pill {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
}
```

Also remove the existing `.planned` / `.planned-title` / `.planned-desc` / `.planned-list` / `.planned-item` rules — they're dead now (we'll add `.wip-*` rules in Task 3.11).

Add a small style for the "ls more" link:

```css
.projects-more {
  margin-top: 1.5rem;
  text-align: right;
}

.projects-more a {
  font-family: var(--font-mono);
  color: var(--accent);
}
```

**Step 3:** Visual check at `http://localhost:8080#projects`:
- Both project cards render
- Tech tags are now bracketed mono pills
- The "Planned" dashed box is GONE from the bottom of the projects section
- A small `> ls more →` link appears below the grid

**Step 4:** Commit.

```bash
git add _includes/partials/projects.njk css/style.css
git commit -m "projects: mono pill tech tags, case study slot, remove planned block"
```

---

### Task 3.5: Case Studies — new partial + CSS

**Files:**
- Create: `_includes/partials/caseStudies.njk`
- Modify: `css/style.css` (add `.case-studies` section styles)

**Step 1:** Create the new partial:

```njk
<section class="case-studies" id="case-studies">
  <div class="section-head">
    <h2 class="section-title">#case-studies</h2>
    <p class="eyebrow eyebrow-com">deep dives</p>
  </div>

  <div class="case-study-grid">
    {% for study in caseStudies %}
    <article class="case-study-card">
      <span class="pill case-study-badge">case study</span>
      <h3 class="case-study-title">{{ study.title }}</h3>
      <p class="case-study-summary">{{ study.summary }}</p>
      {% if study.status == "published" and study.slug %}
      <a href="{{ study.slug | url }}" class="case-study-link">Read case study →</a>
      {% else %}
      <span class="pill pill-dashed case-study-pending">coming soon</span>
      {% endif %}
    </article>
    {% endfor %}
  </div>
</section>
```

**Step 2:** Add CSS after the projects section in `css/style.css`:

```css
/* ============================================================
   Case Studies — 2x2 grid of curated blog post surfaces
   ============================================================ */
.case-study-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .case-study-grid {
    grid-template-columns: 1fr;
  }
}

.case-study-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s ease;
}

.case-study-card:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px rgba(242, 103, 34, 0.2);
  transform: translateY(-3px);
}

.case-study-badge {
  align-self: flex-start;
  font-size: 0.7rem;
}

.case-study-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1.3;
}

.case-study-summary {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.case-study-link {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--accent);
  align-self: flex-start;
  margin-top: auto;
}

.case-study-pending {
  align-self: flex-start;
  margin-top: auto;
  font-size: 0.7rem;
  color: var(--text-muted);
}
```

**Step 3:** This partial isn't included from `index.njk` yet — that happens in Task 4.1. So no visual change in the browser. Build check only:

```bash
npm run build
```

Expected: exit 0.

**Step 4:** Commit.

```bash
git add _includes/partials/caseStudies.njk css/style.css
git commit -m "case-studies: new partial with 2x2 placeholder grid"
```

---

### Task 3.6: Testimonial — new partial + CSS

**Files:**
- Create: `_includes/partials/testimonial.njk`
- Modify: `css/style.css`

**Step 1:** Create the partial:

```njk
<section class="testimonial-section" aria-label="Client testimonial">
  <p class="eyebrow eyebrow-com testimonial-eyebrow">kind words</p>
  <figure class="testimonial-card">
    <blockquote class="testimonial-quote">
      <p>{{ testimonial.pullQuote }}</p>
    </blockquote>
    <figcaption class="testimonial-attr">
      <span class="testimonial-name">— {{ testimonial.name }}</span>
      <span class="testimonial-role">{{ testimonial.role }} · {{ testimonial.org }}</span>
    </figcaption>
  </figure>
</section>
```

**Step 2:** Add CSS:

```css
/* ============================================================
   Testimonial — single pull-quote callout
   ============================================================ */
.testimonial-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  text-align: center;
}

.testimonial-eyebrow {
  text-align: center;
  margin-bottom: 1rem;
}

.testimonial-card {
  margin: 0;
  padding: 2.5rem 2rem;
  background: var(--card-bg);
  border: 1px dashed var(--accent);
  border-radius: 12px;
}

.testimonial-quote {
  margin: 0 0 1.5rem;
}

.testimonial-quote p {
  margin: 0;
  font-size: 1.25rem;
  font-style: italic;
  line-height: 1.5;
  color: var(--text);
}

.testimonial-attr {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
}

.testimonial-name {
  color: var(--text);
  font-weight: 700;
}

.testimonial-role {
  color: var(--text-muted);
}
```

**Step 3:** Build check.

```bash
npm run build
```

Expected: exit 0. (Not yet included in `index.njk`.)

**Step 4:** Commit.

```bash
git add _includes/partials/testimonial.njk css/style.css
git commit -m "testimonial: new partial with SAHS pull-quote callout"
```

---

### Task 3.7: About — copy update + eyebrow

**Files:**
- Modify: `_includes/partials/about.njk`

**Step 1:** Replace the partial:

```njk
<section class="about" id="about">
  <div class="section-head">
    <h2 class="section-title">#about</h2>
    <p class="eyebrow eyebrow-cmd">cat about.md</p>
  </div>
  <div class="about-content">
    <p class="about-p">AWS Certified DevOps Engineer with eight years of hands-on cloud experience. I focus on infrastructure automation, secure-by-default architectures, and building the kind of systems that don't wake people up at 3am.</p>
    <p class="about-p">I came up through support, applications development, and large-scale AWS consulting before going independent. Whether I'm leading a serverless ETL migration or debugging a checkout-bot exploit, the throughline is the same: ship reliable things, document them clearly, and teach what I learn along the way.</p>
    <div class="about-cta">
      <a href="{{ site.resumeUrl | url }}" class="btn btn-primary" download="{{ site.resumeDownloadName }}">Resume ↓</a>
      <a href="{{ site.linkedIn }}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">Connect on LinkedIn</a>
    </div>
  </div>
</section>
```

**Step 2:** Visual check at `http://localhost:8080#about`. Eyebrow appears above the title, copy updated, CTAs unchanged.

**Step 3:** Commit.

```bash
git add _includes/partials/about.njk
git commit -m "about: refined copy + cat about.md eyebrow"
```

---

### Task 3.8: Experience — featured/compact tier rendering

**Files:**
- Modify: `_includes/partials/experience.njk`
- Modify: `css/style.css` (add `.experience-card-featured` and `.experience-card-compact` variants)

**Step 1:** Replace the partial:

```njk
<section class="experience" id="experience">
  <div class="section-head">
    <h2 class="section-title">#experience</h2>
    <p class="eyebrow eyebrow-cmd">git log --career</p>
  </div>
  <div class="experience-list">
    {% for job in experience %}
    <article class="experience-card {% if job.featured %}experience-card-featured{% else %}experience-card-compact{% endif %}">
      <div class="exp-head">
        <h3 class="exp-company">{{ job.company }}</h3>
        {% if loop.first %}<span class="pill exp-pill">current</span>{% elif job.company == 'Amazon Web Services (AWS)' %}<span class="pill exp-pill">aws</span>{% endif %}
      </div>
      <p class="exp-meta">{{ job.title }} · {{ job.dates }} · {{ job.location }}</p>
      <ul class="exp-bullets">
        {% for bullet in job.bullets %}
        <li>{{ bullet }}</li>
        {% endfor %}
      </ul>
    </article>
    {% endfor %}
  </div>
</section>
```

**Step 2:** Update CSS — find the existing `.experience-card` block and replace with these tier variants:

```css
.experience-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.25rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.experience-card-featured {
  padding: 1.5rem 1.75rem;
  border-color: var(--accent);
  box-shadow: 0 0 0 1px rgba(242, 103, 34, 0.15);
}

.experience-card-compact {
  padding: 1rem 1.25rem;
  opacity: 0.85;
}

.experience-card-compact .exp-bullets {
  font-size: 0.85rem;
}

.exp-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.25rem;
}

.exp-pill {
  font-size: 0.65rem;
}
```

**Step 3:** Visual check at `http://localhost:8080#experience`:
- First two cards (Independent Consulting, AWS) should have brighter borders, more padding, full opacity
- Last two cards (GDIT, SCLogic) should be visibly smaller/dimmer
- Independent Consulting card should have a `[ current ]` pill
- AWS card should have an `[ aws ]` pill

**Step 4:** Commit.

```bash
git add _includes/partials/experience.njk css/style.css
git commit -m "experience: featured/compact tier hierarchy + role pills"
```

---

### Task 3.9: Skills — reordered grid + category labels

**Files:**
- Modify: `_includes/partials/skills.njk`
- Modify: `css/style.css` (add `.skills-row-label`)

**Step 1:** Replace the partial. Note: we render in two explicit rows of 5 items each so we can put a label above each row.

```njk
<section class="skills" id="skills">
  <div class="section-head">
    <h2 class="section-title">#skills</h2>
    <p class="eyebrow eyebrow-com">the stack</p>
  </div>

  <p class="skills-row-label">// cloud · iac · languages · runtime · os</p>
  <div class="skills-grid">
    {% for skill in skills %}
      {% if loop.index <= 5 %}
      <div class="skill-item">
        <div class="skill-icon-wrap">
          <img src="{{ skill.icon | url | absoluteUrl }}" alt="" class="skill-icon-img" loading="lazy">
        </div>
        <span class="skill-name">{{ skill.name }}</span>
      </div>
      {% endif %}
    {% endfor %}
  </div>

  <p class="skills-row-label">// vcs · ci · observability · data · practices</p>
  <div class="skills-grid">
    {% for skill in skills %}
      {% if loop.index > 5 %}
      <div class="skill-item">
        <div class="skill-icon-wrap">
          <img src="{{ skill.icon | url | absoluteUrl }}" alt="" class="skill-icon-img" loading="lazy">
        </div>
        <span class="skill-name">{{ skill.name }}</span>
      </div>
      {% endif %}
    {% endfor %}
  </div>
</section>
```

**Step 2:** Add CSS for the row labels:

```css
.skills-row-label {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 1.5rem 0 0.75rem;
  letter-spacing: 0.02em;
}

.skills-row-label:first-of-type {
  margin-top: 0;
}
```

**Step 3:** Visual check at `http://localhost:8080#skills`:
- Two row labels appear (`// cloud · iac · languages · runtime · os` and `// vcs · ci · observability · data · practices`)
- AWS is first in row 1, Agile is last in row 2

**Step 4:** Commit.

```bash
git add _includes/partials/skills.njk css/style.css
git commit -m "skills: reordered grid with mono category labels"
```

---

### Task 3.10: Certifications — Credly badge wall

**Files:**
- Modify: `_includes/partials/certifications.njk`
- Modify: `css/style.css`
- Create: `images/certs/.gitkeep` (empty placeholder so the dir exists in git)

**Step 1:** Create the certs image directory:

```bash
mkdir -p images/certs
touch images/certs/.gitkeep
```

**Step 2:** Add `images/certs` to Eleventy passthrough copy. Edit `.eleventy.js`:

Locate the passthrough block (lines 2-7):
```javascript
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
```

`images` is already passed through wholesale, so the new `images/certs` dir is automatically included. No change needed. Confirm by reading `.eleventy.js`.

**Step 3:** Replace `_includes/partials/certifications.njk`:

```njk
<section class="certifications" id="certifications">
  <div class="section-head">
    <h2 class="section-title">#certifications</h2>
    <p class="eyebrow eyebrow-com">credentials</p>
  </div>

  <div class="certs-grid">
    {% for cert in certifications %}
    {% set inner %}
    <div class="cert-badge">
      <img src="{{ cert.image | url | absoluteUrl }}" alt="{{ cert.name }}" class="cert-image" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <div class="cert-fallback" style="display: none;">
        <span class="cert-fallback-name">{{ cert.shortName or cert.name }}</span>
      </div>
      <span class="cert-caption">{{ cert.shortName or cert.name }}</span>
    </div>
    {% endset %}
    {% if cert.credlyUrl %}
    <a href="{{ cert.credlyUrl }}" target="_blank" rel="noopener noreferrer" class="cert-link" aria-label="{{ cert.name }} on Credly">{{ inner | safe }}</a>
    {% else %}
    <div class="cert-link cert-link-static">{{ inner | safe }}</div>
    {% endif %}
    {% endfor %}
  </div>
</section>
```

The `onerror` handler on the badge `<img>` swaps to a text fallback when the badge PNG is missing — important because Darian hasn't downloaded the badges yet, and the section needs to look acceptable in the meantime.

**Step 4:** Replace the existing `.certs-grid` / `.cert-item` / `.cert-name` CSS block with the badge wall styles:

```css
/* ============================================================
   Certifications — Credly badge wall (4x2 grid)
   ============================================================ */
.certs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

@media (max-width: 768px) {
  .certs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.cert-link {
  display: block;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem;
  text-decoration: none;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s ease;
}

.cert-link:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px rgba(242, 103, 34, 0.2);
  transform: translateY(-3px);
}

.cert-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.cert-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

.cert-fallback {
  width: 100px;
  height: 100px;
  border: 1px dashed var(--border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.5rem;
}

.cert-fallback-name {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--accent);
  line-height: 1.2;
}

.cert-caption {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  text-align: center;
  line-height: 1.3;
}

.cert-link:hover .cert-caption {
  color: var(--text);
}
```

Also remove the dead `.certifications-summary` rule since the blurb is gone.

**Step 5:** Visual check at `http://localhost:8080#certifications`:
- 4×2 grid renders
- Since no badge PNGs exist yet, each cell shows the fallback dashed circle with the short cert name
- On wider screens, the grid is 4 columns; below 768px it becomes 2 columns

**Step 6:** Commit.

```bash
git add _includes/partials/certifications.njk css/style.css images/certs/.gitkeep
git commit -m "certifications: Credly badge wall with fallback for missing images"
```

---

### Task 3.11: Currently Building — rename + restyle

**Files:**
- Create: `_includes/partials/currentlyBuilding.njk` (renamed from any "planned" rendering)
- Modify: `css/style.css` (add `.wip-*` styles)

**Step 1:** Create the new partial:

```njk
<section class="currently-building" id="currently-building">
  <div class="section-head">
    <h2 class="section-title">#currently-building</h2>
    <p class="eyebrow eyebrow-cmd">ls projects/wip</p>
  </div>

  <div class="wip-grid">
    {% for item in planned %}
    <article class="wip-card">
      <span class="pill pill-dashed wip-status wip-status-{{ item.status }}">{{ item.status | replace('-', ' ') }}</span>
      <h3 class="wip-name">{{ item.name }}</h3>
      <p class="wip-desc">{{ item.description }}</p>
    </article>
    {% endfor %}
  </div>
</section>
```

**Step 2:** Add CSS:

```css
/* ============================================================
   Currently Building — WIP cards (deliberately distinct from
   shipped projects: dashed borders, mono titles, lower opacity)
   ============================================================ */
.wip-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 900px) {
  .wip-grid {
    grid-template-columns: 1fr;
  }
}

.wip-card {
  background: var(--card-bg);
  border: 1px dashed var(--accent);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  opacity: 0.88;
  transition: opacity 0.2s, transform 0.2s;
}

.wip-card:hover {
  opacity: 1;
  transform: translateY(-3px);
}

.wip-status {
  align-self: flex-start;
  font-size: 0.65rem;
}

.wip-name {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.01em;
}

.wip-desc {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.5;
}
```

**Step 3:** Build check (`npm run build`). Not wired into `index.njk` yet — Task 4.1 handles that.

**Step 4:** Commit.

```bash
git add _includes/partials/currentlyBuilding.njk css/style.css
git commit -m "currently-building: new WIP partial with distinct dashed cards"
```

---

### Task 3.12: Contact — restyle + sub-line

**Files:**
- Modify: `_includes/partials/contact.njk`
- Modify: `css/style.css` (add `.contact-sub`)

**Step 1:** Replace the partial:

```njk
<section class="contact" id="contact">
  <div class="section-head">
    <h2 class="section-title">#contact</h2>
    <p class="eyebrow eyebrow-cmd">echo $CONTACT</p>
  </div>
  <div class="contact-links">
    <a href="{{ site.linkedIn }}" target="_blank" rel="noopener noreferrer" class="btn btn-primary contact-btn">LinkedIn →</a>
    <a href="{{ site.github }}" target="_blank" rel="noopener noreferrer" class="btn btn-outline contact-btn">GitHub →</a>
    <a href="{{ site.resumeUrl | url }}" class="btn btn-outline contact-btn" download="{{ site.resumeDownloadName }}">Resume ↓</a>
  </div>
  <p class="contact-sub eyebrow eyebrow-com">I check LinkedIn weekly — happy to chat about cloud, AWS, or building things.</p>
</section>
```

**Step 2:** Add CSS:

```css
.contact-btn {
  font-family: var(--font-mono);
  min-width: 140px;
  text-align: center;
}

.contact-sub {
  margin-top: 1.5rem;
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .contact-links {
    flex-direction: column;
  }
  .contact-btn {
    width: 100%;
  }
}
```

**Step 3:** Visual check at `http://localhost:8080#contact`:
- Three buttons render (LinkedIn primary orange, GitHub + Resume outline)
- Sub-line below in mono with `// ` prefix

**Step 4:** Commit.

```bash
git add _includes/partials/contact.njk css/style.css
git commit -m "contact: restyle buttons + add response-time sub-line"
```

---

## Phase 4 — Page wire-up

### Task 4.1: Update `index.njk` — new section order, remove quote, use full footer

**Files:**
- Modify: `index.njk`

**Step 1:** Replace the entire contents of `index.njk` with:

```njk
---
layout: layouts/base.njk
title: Home
---

{% include "partials/nav.njk" %}
{% include "partials/hero.njk" %}
{% include "partials/projects.njk" %}
{% include "partials/caseStudies.njk" %}
{% include "partials/testimonial.njk" %}
{% include "partials/about.njk" %}
{% include "partials/experience.njk" %}
{% include "partials/skills.njk" %}
{% include "partials/certifications.njk" %}
{% include "partials/currentlyBuilding.njk" %}
{% include "partials/contact.njk" %}
{% include "partials/footer.njk" %}
```

Changes vs. current:
- **Removed**: `quote.njk` include
- **Removed**: inline `<footer class="site-footer-minimal">` block
- **Added**: `caseStudies.njk`, `testimonial.njk`, `currentlyBuilding.njk`, `footer.njk`
- **Reordered**: matches design doc IA

**Step 2:** Visual check at `http://localhost:8080`:
- **Full page sweep** — scroll top to bottom and confirm every section renders in the correct order:
  1. Sticky nav with `Let's Talk →` CTA
  2. Hero (split screen, broken image still — that's Phase 5)
  3. Projects
  4. Case Studies (4 placeholder cards with `[ coming soon ]` badges)
  5. Testimonial (Aubrey/SAHS quote)
  6. About
  7. Experience (featured/compact tiers)
  8. Skills (reordered with row labels)
  9. Certifications (badge wall fallback)
  10. Currently Building (3 dashed WIP cards)
  11. Contact (3 buttons + sub-line)
  12. Footer (3-column with motto, latest writing, quick links + bottom-bar `> whoami` echo)
- **No quote section** between hero and projects
- Sticky nav `Let's Talk →` smooth-scrolls to contact

**Step 3:** Build check (`npm run build`). Expected: exit 0.

**Step 4:** Commit.

```bash
git add index.njk
git commit -m "index: new section order, drop quote, use full footer"
```

---

## Phase 5 — Image assets

### Task 5.1: Optimize hero photo to web size

**Why:** The source PNG is 16 MB — too large to ship. We need a ~150 KB optimized version at `images/self/hero-darian.png` (which is the path the hero partial expects, and the only `images/self/` file allowed by the `.gitignore` rule from Task 0.1).

**Files:**
- Create: `images/self/hero-darian.png` (optimized output)

**Step 1:** Determine which optimization tool is available. Try in order:

```bash
which sharp 2>/dev/null || which magick 2>/dev/null || which convert 2>/dev/null || which cwebp 2>/dev/null
```

**Option A — `sharp` CLI** (if installed):
```bash
npx sharp-cli \
  --input images/self/IMG_2287_wout_background.png \
  --output images/self/hero-darian.png \
  resize 800
```

**Option B — ImageMagick `magick` (v7+)**:
```bash
magick images/self/IMG_2287_wout_background.png \
  -resize 800x \
  -strip \
  -define png:compression-level=9 \
  images/self/hero-darian.png
```

**Option C — ImageMagick `convert` (v6)**:
```bash
convert images/self/IMG_2287_wout_background.png \
  -resize 800x \
  -strip \
  -define png:compression-level=9 \
  images/self/hero-darian.png
```

**Option D — fallback: Pillow (Python)** if no native tools:
```bash
python3 -c "
from PIL import Image
img = Image.open('images/self/IMG_2287_wout_background.png')
img.thumbnail((800, 800), Image.LANCZOS)
img.save('images/self/hero-darian.png', 'PNG', optimize=True)
"
```

**Step 2:** Check the resulting file size:

```bash
ls -lh images/self/hero-darian.png
```

Expected: under 500 KB. Ideally 150–300 KB for a transparent PNG at 800px width.

**Step 3:** Visual check at `http://localhost:8080`. The hero photo should now render on the right side of the orange block, with the head extending slightly above the block top edge.

**Step 4:** Commit. Since the source PNG is gitignored but `hero-darian.png` is whitelisted by the `!images/self/hero-darian.png` exception in `.gitignore`, this should track:

```bash
git add images/self/hero-darian.png
git status   # confirm hero-darian.png is staged but IMG_2287_wout_background.png is not
git commit -m "add optimized hero photo (800px, ~XXkb)"
```

---

### Task 5.2: Cert badge scaffold (defer real downloads)

**Why:** Darian needs to log into Credly and download all 8 official badge PNGs. That's a content task, not a code task, and shouldn't block this revamp from shipping. The fallback rendering from Task 3.10 makes the section presentable in the meantime.

**Files:**
- Create: `images/certs/README.md`

**Step 1:** Create a README in the certs dir explaining what's needed:

```markdown
# Cert badge images

Drop the official Credly badge PNGs here, named to match the `image` paths in `_data/certifications.json`:

- `aws-devops-pro.png`
- `aws-sysops.png`
- `aws-developer.png`
- `aws-ccp.png`
- `aws-ai.png`
- `comptia-secplus.png`
- `hashicorp-tf.png`
- `msft-az900.png`

To get them:
1. Log into https://www.credly.com (use AWS / CompTIA / HashiCorp / Microsoft SSO as appropriate)
2. Open each badge → "Share" → download the badge image (PNG, ~600x600)
3. Rename to match the filenames above
4. Place in this directory
5. While there, copy the public verification URL for each badge and paste into the matching `credlyUrl` field in `_data/certifications.json`

Until these are populated, the certifications section renders a text fallback per cert (handled by `certifications.njk`).
```

**Step 2:** Commit.

```bash
git add images/certs/README.md
git commit -m "docs: add cert badge scaffold README"
```

---

### Task 5.3: Year + site.json sanity pass

**Files:**
- Modify: `_data/site.json` (verify only)

**Step 1:** Read `_data/site.json` and confirm:
- `year` is current (2026)
- `headline` value is no longer used by the hero (which now hardcodes `I'm Darian.`) but is harmless to leave in place. Don't delete it — `quote.njk` may still reference it, and other future templates might too.
- `linkedIn`, `github`, `resumeUrl`, `resumeDownloadName` are unchanged

**Step 2:** No edits required unless something's stale. If everything's correct, no commit. Otherwise edit and commit:

```bash
git add _data/site.json
git commit -m "site.json: sanity pass"
```

---

## Phase 6 — QA & polish

### Task 6.1: Lighthouse audit

**Step 1:** With the dev server running, open Chrome DevTools → Lighthouse → run an audit on `http://localhost:8080` with:
- Categories: Performance, Accessibility, Best Practices, SEO
- Mode: Navigation
- Device: Desktop *and* Mobile (run twice)

**Step 2:** Target scores:
- Performance: ≥90
- Accessibility: ≥95
- Best Practices: ≥95
- SEO: ≥95

**Step 3:** For any score below target, address the **top 1–2 issues** Lighthouse flags. Likely candidates:
- Images without explicit `width`/`height` → add to `<img>` tags
- Color contrast on muted text → bump `--text-muted` slightly lighter if needed
- Missing `alt` text → add to any decorative images
- No skip-to-content link → add one in `base.njk`

**Step 4:** Commit any fixes:

```bash
git add <files>
git commit -m "lighthouse: address <issue>"
```

---

### Task 6.2: Mobile responsive sweep

**Step 1:** In Chrome DevTools responsive mode, test these widths:
- 375px (iPhone SE)
- 414px (iPhone Plus)
- 768px (iPad portrait)
- 1024px (iPad landscape)
- 1440px (laptop)

**Step 2:** For each width, scroll the home page top to bottom. Check:
- Hero stacks correctly (orange block on top, dark content below at <900px)
- Hero stat strip wraps gracefully
- Project cards become single-column at <768px
- Case studies grid becomes single-column at <768px
- Cert grid drops from 4 cols to 2 cols at <768px
- WIP grid drops from 3 cols to 1 col at <900px
- Contact buttons stack vertically at <600px
- Footer columns stack at <768px
- Nav hides nav-links and shows just brand + CTA at <600px (per the rule we added)

**Step 3:** Fix any layout issues. Common fixes:
- Add a media query
- Adjust `grid-template-columns`
- Reduce padding at small breakpoints

**Step 4:** Commit any fixes.

---

### Task 6.3: Reduced-motion verification

**Step 1:** In Chrome DevTools, open the rendering tab and set "Emulate CSS media feature prefers-reduced-motion" to `reduce`.

**Step 2:** Reload `http://localhost:8080`. Confirm:
- Hero typewriter shows the static line `I develop cloud infra` (no cycling)
- Cursor `_` does NOT blink (because the CSS animation respects reduced-motion via the JS check OR the CSS keyframe — verify both)
- All hover transforms (`translateY(-3px)`) still work, but they're not blocked under reduced-motion (acceptable for hover)

**Step 3:** If the cursor still blinks under reduced-motion, wrap the keyframe in a guard:

```css
@media (prefers-reduced-motion: no-preference) {
  .hero-typewriter-cursor {
    animation: typewriter-blink 1s step-end infinite;
  }
}
```

And remove the unconditional animation from the base `.hero-typewriter-cursor` rule.

**Step 4:** Commit any fixes.

```bash
git add css/style.css
git commit -m "a11y: gate cursor blink behind prefers-reduced-motion"
```

---

### Task 6.4: Cross-page footer parity check

**Step 1:** Visit each page and verify the footer renders identically (modulo the conditional column 2):
- `http://localhost:8080/` → home, with "Latest Writing" column
- `http://localhost:8080/blog/` → blog index, with "Categories" column
- `http://localhost:8080/blog/posts/<any-post>/` → blog post, with "Categories" column

For all three:
- Same motto, same author bio, same Follow on GitHub button (column 1)
- Same Quick Links (column 3)
- Same bottom bar with copyright + `> whoami · Darian Lee`

**Step 2:** If anything differs, fix `footer.njk`.

**Step 3:** Commit any fixes.

---

### Task 6.5: Final commit + merge prep

**Step 1:** Run a final full build:

```bash
npm run build
```

Expected: exit 0, `_site/` populated.

**Step 2:** Verify no committed file is the giant source PNG:

```bash
git ls-files images/self/
```

Expected: only `hero-darian.png` (or empty if Phase 5 didn't run yet).

**Step 3:** Confirm git status is clean.

```bash
git status
```

Expected: `nothing to commit, working tree clean`.

**Step 4:** Show the full commit log of the branch:

```bash
git log main..HEAD --oneline
```

Expected: ~25–30 commits (one per task), each with a clear message.

**Step 5:** Done. Ready to merge.

```bash
# When approved:
git checkout main
git merge --no-ff portfolio-revamp -m "merge: portfolio revamp (Mikon-style hero + engineering accents)"
```

---

## Post-implementation deferred items

These items are content-side, not code-side, and don't block the revamp from shipping:

1. **Cert badges + Credly URLs** — Darian downloads from Credly per `images/certs/README.md`, then updates `_data/certifications.json` `credlyUrl` fields. The fallback rendering ships acceptably without them.
2. **Case study writeups** — Darian writes 4 blog posts under `blog/posts/case-study-*.md`, then updates `_data/caseStudies.json` to flip `status: "coming-soon"` → `status: "published"` and populate the `slug` field.
3. **About copy refinements** — Darian can edit `about.njk` directly anytime.
4. **Add new currently-building items** — append to `_data/planned.json` with the documented schema.

---

## Notes for the implementer

- **The dev server should be running for the entirety of Phase 1–6** so visual checks are instant. Use `npm start` and leave it.
- **Frequent commits** — every task ends with a commit. If a task fails midway, you can `git reset --hard HEAD` and retry the task without losing earlier work.
- **Don't refactor unrelated CSS** — the existing `css/style.css` has lots of styles that are tangentially related. Only touch rules that are explicitly named in the plan or that are dead code being removed (`.planned-*` for example). Don't reformat, don't reorder, don't "improve" anything we didn't ask for.
- **Eleventy hot reload** sometimes misses data file changes — if a JSON edit doesn't propagate, hit Ctrl+C on the dev server and `npm start` again.
- **If something looks wrong**, check the *design doc* first. It is the source of truth for visual decisions; this plan is the source of truth for *which file gets edited when*.
- **The hero is the highest-risk task** — if it goes sideways, isolate it with `git diff` and revert just that commit, then redo. Don't try to fix-forward through a broken hero.
