# Portfolio Revamp — Design Doc

**Date**: 2026-04-11
**Status**: Approved, ready for implementation planning
**Stack**: Eleventy 2.x · Nunjucks · vanilla CSS · GitHub Pages

---

## 1. Goals & non-goals

### Goal
Recruiters and curious technical folks land on the home page, immediately register that Darian is credible, and reach out via LinkedIn or GitHub. Every design decision ladders up to that single conversion.

### Non-goals
- Lead-gen funnels, contact forms, or anything that collects email addresses
- Consulting agency positioning
- Pretending to have more clients than actually exist
- Third-party form services, analytics, or trackers
- React, build tools beyond Eleventy, or any JS framework

---

## 2. Direction

**Mikon-style hero (visual punch above the fold) + engineering-coded accents (credibility throughout).** Bold, attention-grabbing front door; restrained, credibility-focused body. Terminal/code-flavored decorative language instead of designer-template playful sparkles.

Inspiration reference: Envato "Mikon" template (split-screen hero with cutout photo, big stat strip, typewriter tagline, vertical accent text, sticky CTA). We borrow the **structure**, not the **aesthetic** — Mikon reads as designer/agency; ours reads as engineer.

---

## 3. Design system updates

### Color
- **Accent**: `#ef3924` (red-orange) → **`#f26722`** (true orange)
- One CSS variable change (`--accent`) propagates everywhere. Update `--accent-glow`, `--accent-pink`, `--border` derivatives accordingly.
- Dark theme stays. `--bg` remains `#000000`.

### Typography
- **Body**: existing system sans stack stays
- **NEW: Monospace stack** for accent labels, eyebrows, code-flavored decorations, button labels, mono pills:
  ```
  ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace
  ```

### Section title pattern (kept)
- Existing `#section` lowercase-hash treatment is preserved — it's already engineering-coded and a strong identifier.

### NEW accent vocabulary
Two distinct flavors that should not be mixed within a single label:

**Command prompt style** (`>` prefix) — used when something *acts* or *outputs*:
- `> whoami` (hero eyebrow)
- `> cat about.md` (about eyebrow)
- `> git log --career` (experience eyebrow)
- `> ls projects/wip` (currently-building eyebrow)
- `> echo $CONTACT` (contact eyebrow)
- `> ls more →` (link to GitHub from projects)

**Comment style** (`//` prefix) — used when something *labels* or *categorizes*:
- `// shipped` (projects sub-label)
- `// deep dives` (case studies)
- `// kind words` (testimonial)
- `// the stack` (skills)
- `// credentials` (certifications)
- `// about` `// quick links` `// latest writing` (footer columns)

### Mono pill pattern
Bracketed, monospace, orange-bordered pills used for:
- Tech stack tags on project cards (`[ terraform ]`, `[ aws ]`)
- Status badges (`[ in dev ]`, `[ planning ]`, `[ coming soon ]`, `[ current ]`, `[ aws ]`)
- The hero typewriter container (`[ I develop cloud infra _ ]`)
- The hero CTA (`[ Get in touch → ]`)
- The "automation" floating icon in hero (`[ automation ]`)

Hover state: orange glow border, subtle lift (`translateY(-3px)`). Reuses existing card hover language.

---

## 4. Information architecture

Single-page home (existing pattern) + separate `/blog/`. New section order:

1. **Sticky Nav** — `Darian` · Home · Projects · Blog · About · Contact · `[ Let's Talk → ]`
2. **Hero** — split-screen, photo, typewriter tagline, stat strip
3. **Featured Projects** — shipped only
4. **Case Studies** — NEW, 2×2 placeholder grid linking to blog posts
5. **Testimonial** — NEW, single pull-quote callout
6. **About** — refined copy, no photo
7. **Experience** — featured/compact tier split for visual hierarchy
8. **Skills** — refined grid (reordered, grouped, no proficiency dots)
9. **Certifications** — Credly badge wall (replaces text boxes)
10. **Currently Building** — renamed from "Planned", visually distinct from shipped
11. **Contact** — 3 buttons (LinkedIn / GitHub / Resume), no form
12. **Footer** — full 3-column (replaces home page minimal footer)

The current `quote.njk` partial ("You don't have to be an expert...") gets retired from the home page. Its philosophical role moves to the footer alongside the "Always Building. Always Learning. Always Sharing." motto.

---

## 5. Section specifications

### 5.1 Sticky Nav
- Existing nav structure, with a new right-aligned **`[ Let's Talk → ]`** CTA pill (filled orange, mono font).
- Clicking `[ Let's Talk → ]` smooth-scrolls to `#contact`.
- Active section indicator on nav links (existing underline pattern stays).
- Mobile: existing collapse pattern.

### 5.2 Hero

**Layout**: Split screen, ~55% / 45%, dark left + orange-block right. Stacks vertically on mobile (orange block on top, dark content below).

**Left half (~55%, `#000` background):**
- Eyebrow: `> whoami` (mono, muted)
- Headline: `I'm Darian.` (huge, white, bold)
- **Typewriter sticker tagline** in a bordered mono pill that cycles through:
  1. `[ I develop cloud infra _ ]`
  2. `[ I automate DevOps _ ]`
  3. `[ I ship AWS systems _ ]`
  4. `[ I build agentic AI tools _ ]`
  - ~2.5–3s visible per role, smooth typing/erasing animation between roles
  - `_` cursor blinks
  - Pure CSS animation, no JS framework
  - **Reduced-motion fallback**: shows `[ I develop cloud infra _ ]` statically (no animation) when `prefers-reduced-motion: reduce`
- CTA: `[ Get in touch → ]` button (filled orange, smooth-scrolls to `#contact`)
- **Stat strip** — 3 stats only:
  ```
  8+              4,400+              8
  Years           Engineers           Certifications
  Building        Reached
  ```
  - Numbers huge and white-bold
  - `+` is accent-orange
  - Labels muted-gray, smaller
  - Thin vertical accent dividers between columns
  - Mobile: stacks 1×3 or single column
  - **No 4th stat** — three is intentionally tight and Mikon-aligned

**Right half (~45%, solid `#f26722` block):**
- **Photo**: `IMG_2287_wout_background.png` (warm fuller-smile shot, transparent background)
- Photo is sized so the **head extends slightly above the orange block's top edge** (Mikon's signature trick — breaks the rectangle, adds depth)
- Vertical rotated text on the far-right edge: `// MY · STACK ·` (mono, white-on-orange)
- 4 floating stack icons stacked vertically along the right edge:
  - `aws` (logo, existing in `/images/blog/skills/aws.png`)
  - `terraform` (logo)
  - `python` (logo)
  - `[ automation ]` (mono text pill — there's no canonical "automation" logo, and the text-pill treatment fits the engineering-coded direction)
- Code-glyph decorations replace Mikon's playful sparkles — small `>`, `//`, `[ ]` accents in white-on-orange

**Photo handling note**: The hero photo is the *only* place a real photo appears on the entire site. Blog author bio and any other secondary placement keeps the existing avatar. This is deliberate — single-image strategy avoids photo fatigue and lets the hero photo carry maximum impact.

### 5.3 Featured Projects

- **Title**: `#projects` · eyebrow `// shipped`
- Same 2 cards from existing `_data/projects.json` (EKS Framework, Secure Cloud Baseline)
- Card upgrades:
  - Larger hero image area
  - Tech tags become **mono pills** (`[ terraform ]`, `[ kubernetes ]`, `[ aws ]`, etc.) instead of plain text dot-separators
  - Two action links per card: **`View repo →`** and (when populated) **`Read case study →`**
  - Hover lifts card + accent glow border
- Below the grid: small mono link **`> ls more →`** to the GitHub profile
- **Critical**: the "Planned" box currently inside this section is **removed**. Planned projects move to section 5.10 (Currently Building), far away, with clearly distinct styling so they can never be mistaken for shipped work.

### 5.4 Case Studies (NEW)

- **Title**: `#case-studies` · eyebrow `// deep dives`
- 2×2 grid, 4 cards
- Each card: `[ case study ]` mono pill badge, title, 1-line summary, **`Read case study →`** link
- These are *curated front-page surfaces* for blog posts under a `Case Study` category — not a new content type
- **Placeholder strategy**: until Darian writes the case studies, all 4 cards render with title + 1-line summary + a `[ coming soon ]` badge instead of a working link. When a case study is published as `/blog/posts/case-study-*.md`, the placeholder gets swapped for a real link.
- **NEW data file**: `_data/caseStudies.json` — 4 entries with fields:
  ```json
  {
    "title": "...",
    "summary": "...",
    "status": "coming-soon",   // coming-soon | published
    "slug": null               // populated when published, e.g. "/blog/posts/case-study-woocommerce-bots/"
  }
  ```
- This keeps the home page render fast (no scanning the full blog collection at build time) and the data explicit
- **Initial 4 case study topics** (titles to be finalized during content writing):
  1. SAHS WooCommerce checkout bot remediation (real client work)
  2. iac-to-diagram (personal project)
  3. ai-interview-prep (personal project)
  4. daily-feed (personal project)

### 5.5 Testimonial (NEW)

- **No `#header`** — it's a centered quote callout, not a sectioned area
- Eyebrow only: `// kind words`
- **Pull-quote** (extracted from the full SAHS testimonial, Ventrov references stripped):
  > *"His thorough explanations and responsive communication style enabled us to make the best decisions for our website. He came in with the needed repairs on time and on budget."*
- Attribution in mono below:
  ```
  — Aubrey
    Project Manager · Swedish American Historical Society
  ```
- **No stars** (the source had stars; we're dropping them — the named real org carries credibility better than rating UI)
- Visual treatment: dark card, subtle orange dotted border, generous padding, big italic quote text
- **NEW data file**: `_data/testimonial.json` — single object so the full quote is preserved in the repo even though only the pull-quote renders:
  ```json
  {
    "pullQuote": "...",
    "fullQuote": "...",
    "name": "Aubrey",
    "role": "Project Manager",
    "org": "Swedish American Historical Society"
  }
  ```
- The current `quote.njk` partial (personal motto) is **removed from the home page**. The personal motto "You don't have to be an expert..." retires from the home page entirely. The "Always Building. Always Learning. Always Sharing." motto relocates to the footer.

### 5.6 About

- **Title**: `#about` · eyebrow `> cat about.md`
- **No photo** (hero is the only photo placement)
- **Updated copy** (replaces existing `about.njk` text):
  > *AWS Certified DevOps Engineer with eight years of hands-on cloud experience. I focus on infrastructure automation, secure-by-default architectures, and building the kind of systems that don't wake people up at 3am.*
  >
  > *I came up through support, applications development, and large-scale AWS consulting before going independent. Whether I'm leading a serverless ETL migration or debugging a checkout-bot exploit, the throughline is the same: ship reliable things, document them clearly, and teach what I learn along the way.*
- CTAs unchanged: `[ Resume ↓ ]`  `[ Connect on LinkedIn ]`
- Note: "5 years" framing in current copy → updated to **"eight years"** (matches the hero stat strip)
- The 4,400+ engineers stat is intentionally **removed from the about copy** because it now lives prominently in the hero stat strip

### 5.7 Experience

- **Title**: `#experience` · eyebrow `> git log --career`
- **Visual hierarchy** via two tiers (no data structure changes — just CSS variants triggered by a `featured` flag in `experience.json`):

**Featured tier** (large cards, accent borders, full bullets):
- Independent Consulting (current — `[ current ]` mono pill in corner)
- Amazon Web Services (flagship 5-year tenure — `[ aws ]` mono pill in corner)

**Compact tier** (smaller cards, condensed bullets, muted accents):
- GDIT
- SCLogic

- **`experience.json` schema upgrade** — add `"featured": true|false` to each entry
- Bullets stay as-is from existing data
- All four roles still visible (no career gaps hidden) — just visually weighted to reflect importance

### 5.8 Skills

- **Title**: `#skills` · eyebrow `// the stack`
- Same 5-column icon grid pattern, with three upgrades:
  1. **Reordered by relevance**:
     - Row 1: `aws · terraform · python · docker · linux`
     - Row 2: `github · gitlab · grafana · sql · agile`
  2. **Mono category labels** above each row:
     - Row 1: `// cloud · iac · languages · runtime · os`
     - Row 2: `// vcs · ci · observability · data · practices`
  3. **Hover state** matches site-wide pattern (orange glow border, lift)
- **Explicitly NOT adding**: proficiency dots, year counts, more skills. The grid is enough.
- `_data/skills.json` reorders to match the new sequence

### 5.9 Certifications

- **Title**: `#certifications` · eyebrow `// credentials`
- **Replaces** existing text boxes with a real **Credly badge wall**
- **Layout**: 4×2 grid, ~120px square badges, dark card backgrounds, hover lift + accent border
- **Order** (intentional — strongest credential top-left):
  1. AWS Certified DevOps Engineer – Professional
  2. AWS Certified SysOps Administrator
  3. AWS Certified Developer
  4. AWS Certified Cloud Practitioner
  5. AWS Certified AI Practitioner
  6. CompTIA Security+
  7. HashiCorp Terraform Associate
  8. Microsoft Azure Fundamentals (AZ-900)
- Each badge is a clickable link to its public Credly verification URL
- **`_data/certifications.json` schema upgrade** — entries become objects:
  ```json
  {
    "name": "AWS Certified DevOps Engineer – Professional",
    "image": "/images/certs/aws-devops-pro.png",
    "credlyUrl": "https://www.credly.com/badges/<badge-id>"
  }
  ```
- The `certifications-summary` blurb above the grid is **removed** — badges speak for themselves
- **Pre-implementation prerequisite**: Darian must download all 8 official Credly badge PNGs and grab each badge's public verification URL

### 5.10 Currently Building (renamed from "Planned")

- **Title**: `#currently-building` · eyebrow `> ls projects/wip`
- Lives **far away** from `#projects` in the page flow
- **Visual treatment** deliberately distinct from shipped projects:
  - Dashed orange borders (instead of solid)
  - Slightly lower opacity (~85%)
  - Mono font for project names (instead of sans)
  - Status pill on every card: `[ planning ]` / `[ in dev ]` / `[ alpha ]` / `[ coming soon ]`
  - **No "View repo" button** unless a public repo exists
- **Items** (3 cards, in this order):
  1. **`ai-interview-prep`** — `[ in dev ]` — *"An AI-powered tool that turns any job description into a personalized study plan, flashcards, and practice questions — so candidates walk into interviews fully prepared."* (kept anonymous, no product brand)
  2. **`iac-to-diagram`** — `[ planning ]` — existing description
  3. **`daily-feed`** — `[ planning ]` — *"A topic-organized RSS aggregator designed to live as a browser homepage. Pull feeds from across tech, news, and personal interests into one daily reading view."*
- Removed from current `planned.json`: `terraform-pr-explainer`, `aws-bill-translator`
- **`planned.json` schema upgrade**:
  ```json
  {
    "name": "ai-interview-prep",
    "description": "...",
    "status": "in-dev"
  }
  ```

### 5.11 Contact

- **Title**: `#contact` · eyebrow `> echo $CONTACT`
- **Three big buttons** in a row (stack on mobile):
  - **`LinkedIn →`** — primary, filled orange (strongest inbound channel)
  - **`GitHub →`** — outline orange
  - **`Resume ↓`** — outline orange (download)
- **Sub-line** below in mono:
  > `// I check LinkedIn weekly — happy to chat about cloud, AWS, or building things.`
- This section is the scroll target for the sticky nav `[ Let's Talk → ]` button
- **No form, no email, no phone** — explicit non-goal
- **No third-party form services** (no Web3Forms, Formspree, etc.)

### 5.12 Footer

- **Replaces** the home page's current minimal footer (`<footer class="site-footer-minimal">`) with the **3-column footer the blog already uses**
- One footer to maintain across home + blog + all blog posts
- **3 columns**:

**Column 1 — `// about`**
- Relocated motto: **"Always Building. Always Learning. Always Sharing."** (3 lines, accent-colored, mono or styled)
- Existing `authorBioFooter` text from `site.json`
- `[ Follow on GitHub ]` CTA

**Column 2 — `// quick links`**
- Home, Projects, Blog, About, Contact
- GitHub ↗, LinkedIn ↗

**Column 3 — `// latest writing`**
- Auto-pulls the **2 most recent blog posts** via existing Eleventy `posts` collection
- Each entry: title + date
- `View all posts →` link
- This auto-updates whenever a new post is published — keeps the home page feeling alive

**Bottom bar:**
- Left: `© 2026. Made by Darian.`
- Right: small mono `> whoami · Darian Lee` (callback to hero eyebrow — closes the visual loop)

---

## 6. Data file changes summary

| File | Change |
|---|---|
| `_data/site.json` | Update if needed (motto extraction, copy tweaks) |
| `_data/projects.json` | No structural change (Planned removed from this rendering) |
| `_data/planned.json` | Replace contents: 3 items (`ai-interview-prep`, `iac-to-diagram`, `daily-feed`), add `status` field |
| `_data/experience.json` | Add `featured: true|false` field per entry |
| `_data/skills.json` | Reorder to match new layout |
| `_data/certifications.json` | Convert from string array to object array (`name`, `image`, `credlyUrl`) |
| `_data/caseStudies.json` | **NEW** — 4 placeholder entries |
| `_data/testimonial.json` | **NEW** — pull-quote, full quote, attribution |

---

## 7. Partial files (Eleventy `_includes/partials/`)

| File | Change |
|---|---|
| `nav.njk` | Add `[ Let's Talk → ]` CTA on the right |
| `hero.njk` | **Major rewrite** — split-screen layout, typewriter, stats, photo placement |
| `quote.njk` | **Removed from `index.njk` include chain** (file can stay or be deleted) |
| `projects.njk` | Update tech tag rendering to mono pills, add "Read case study" link logic, **remove planned block** |
| `caseStudies.njk` | **NEW partial** |
| `testimonial.njk` | **NEW partial** |
| `about.njk` | Update copy, remove embedded image references if any |
| `experience.njk` | Add featured/compact tier rendering |
| `skills.njk` | Update layout, add category labels |
| `certifications.njk` | **Major rewrite** — replace text boxes with badge images, remove summary blurb |
| `currentlyBuilding.njk` | **NEW partial** (renamed from any "planned" rendering) |
| `contact.njk` | Update sub-line, restyle buttons to match new system |
| `footer.njk` | Already mostly 3-column from blog usage; add motto, latest-posts column, bottom bar `> whoami` echo |

---

## 8. CSS changes (`css/style.css`)

- **Color variable update**: `--accent: #ef3924` → `#f26722`, propagate derived values
- **NEW: monospace font stack variable**: `--font-mono`
- **NEW: mono pill component class** (`.pill`) — reusable for tech tags, status badges, button labels
- **NEW: hero split-screen grid** with photo positioning
- **NEW: typewriter animation keyframes** + reduced-motion media query
- **NEW: stat strip layout**
- **NEW: vertical rotated text utility** for hero right edge
- **NEW: featured/compact experience card variants**
- **NEW: dashed-border WIP card variant** for currently-building section
- **NEW: cert badge wall grid**
- **Updated**: footer styles for 3-column home page use (mostly already exists from blog)

---

## 9. Image assets

| Asset | Source | Destination | Notes |
|---|---|---|---|
| Hero photo | `images/self/IMG_2287_wout_background.png` (16 MB source) | `images/self/hero-darian.png` | Optimized to ~150 KB during implementation |
| 8× cert badges | Credly downloads | `images/certs/<cert-slug>.png` | Darian to download from Credly account |
| Existing skill icons | `images/blog/skills/*` | unchanged | Already exist |

**`.gitignore` addition**: exclude the multi-MB original photo from being committed.

---

## 10. Open content items (filled in during implementation, not blockers)

These are all *content* items that don't block design or implementation start:

1. **Case study writeups** — 4 blog posts to be written by Darian over time
2. **Cert badge images + Credly URLs** — Darian to download/grab
3. **Optional**: photo of `IMG_2287` re-optimized to web size (~150 KB)
4. **Optional**: refinements to about copy if Darian wants to edit further

---

## 11. Out of scope

Explicitly **not** in this revamp:
- Contact form / form backend
- Email or phone publication
- Newsletter signup
- Analytics or tracking
- Dark/light mode toggle (stays dark-only)
- Internationalization
- A `/consulting` or `/hire` dedicated landing page (deferred — current scope keeps it as a single home page)
- New blog post types or content models beyond the existing markdown posts
- Comments system changes (Giscus stays as-is)
- New page templates beyond the home page revamp
- React, Vue, or any client-side framework
- Build pipeline changes beyond what Eleventy already does

---

## 12. Success criteria

The revamp is successful when:
1. A recruiter landing on the home page sees Darian's photo, name, role, and 3 strong stats **above the fold**, on both desktop and mobile.
2. Shipped projects and WIP projects are **visually impossible to confuse**.
3. The certifications are visually credible (real badges, not text boxes).
4. There is a clear, prominent path to LinkedIn from anywhere on the page (sticky nav CTA + contact section).
5. The blog page footer and home page footer are visually identical (one footer, used everywhere).
6. The page loads fast — no JS framework, no third-party scripts beyond what already exists (Giscus on blog only).
7. The page is keyboard- and screen-reader-accessible. Reduced-motion users see no animation.

---

## 13. Next step

Run `/writing-plans` to generate the per-task implementation plan from this design doc.
