# New Portfolio Site — Q&A: Security, Cost, and Privacy

Use this **after** reading `NEW_SITE_QA_AND_SPEC.md`. It focuses on **security**, **cost efficiency**, and **keeping personal information off the public site** while making recruiters want to reach out.

---

## 1. Personal information (PII) — what stays off the site

### 1.1 What should never appear on the public site?

| Item | Your resume | Recommendation for site |
|------|-------------|--------------------------|
| **Phone** | 240-520-8051 | **Do not show.** Recruiters get it from LinkedIn or after you reply. |
| **Personal email** | darian.b.lee@gmail.com | **Do not show.** Use a contact form or “Message me” that delivers to you without exposing the address. |
| **Physical address** | (City/state only on resume) | **Do not show.** Not needed for a portfolio. |
| **LinkedIn** | linkedin.com/in/darian-873 | **Show.** Standard for recruiters; you control what’s on your profile. |
| **GitHub** | github.com/its-d | **Show.** Professional, expected for technical roles. |
| **Blog URL** | its-d.github.io/blog | **Optional.** Link to your blog if it lives on same or separate site. |

**Spec alignment:** Your spec already says: *“LinkedIn, GitHub, and a message me box without showing my specific email address and information.”* That’s the right line.

---

### 1.2 How should “Message me” work without exposing email?

**Options (no email on the page):**

1. **Formspree (or similar)**  
   - Form posts to Formspree; they email you.  
   - Your real email is only in Formspree’s dashboard (and in the “Send to” they use).  
   - **Security:** Don’t put your email in repo config that’s public. Use Formspree’s project ID in the form `action` and set the receiving address in Formspree’s UI (env/secrets if you ever self-host).  
   - **Spam:** Use Formspree’s reCAPTCHA/honeypot if available; keeps bots down.

2. **“Contact me on LinkedIn” CTA only**  
   - No form; just a button/link to your LinkedIn.  
   - Zero PII on site; all contact goes through LinkedIn.  
   - Easiest and no third-party form service.

3. **Hybrid**  
   - “Message me” form (Formspree) **and** “Or reach me on LinkedIn” link.  
   - Gives recruiters a choice; you still never show email on the page.

**Recommendation:** Formspree (or GetForm) with reCAPTCHA, **and** a clear LinkedIn link. Do not put `mailto:` with your real email anywhere on the public site.

---

### 1.3 What about the old site and existing content?

- **Current Jekyll `_config.yml`:** No `author_email` or `formspree_email` in the extracted config (they’re commented). Good — nothing to strip from there for PII.
- **`_layouts/about-me.html`:** If you reuse any “about” layout, ensure it does **not** render `author_email` or `author_location` (or any phone/address) on the new site. New site should have no such variables set.
- **Blog posts:** Your existing post (e.g. bot-attacks) doesn’t need to include your phone/email. Keep author as “Darian Lee” and link to LinkedIn/GitHub only.
- **Resume PDF:** Do **not** host the full resume PDF on the public site if it contains phone/email/address. If you want a “resume” link, use a sanitized version (no phone, no personal email, or “Available on request via LinkedIn”) or link to a LinkedIn “View resume” flow instead.

---

## 2. Security

### 2.1 What are the main security considerations?

| Area | Risk | Mitigation |
|------|------|------------|
| **Secrets in repo** | AWS keys, Formspree project ID, or email in source | Never commit secrets. Use GitHub Actions secrets for `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`; keep Formspree “to” email only in Formspree dashboard. |
| **Contact form** | Spam, injection, scraping | Use Formspree (or similar) with their reCAPTCHA/honeypot; no custom backend. Keeps you from running form-handling code. |
| **Third-party scripts** | Tracking, ads, or unknown JS | Prefer minimal: no unnecessary analytics or third-party scripts on v1. If you add analytics later, use a privacy-respecting option and disclose in a one-line “Privacy” note. |
| **Hosting (S3 + CloudFront)** | Bucket open to world, no HTTPS | S3 bucket for static site: public read-only for site content; no write from internet. CloudFront in front with HTTPS only. |
| **CI/CD** | Compromised GitHub or workflow | One IAM user (or OIDC role) with minimal permissions: S3 PutObject + CloudFront CreateInvalidation only. No admin keys in Actions. |

---

### 2.2 GitHub Actions and AWS

- **Secrets:** Store `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in repo **Settings → Secrets and variables → Actions**. Reference in workflow as `secrets.AWS_ACCESS_KEY_ID`, etc. Never log them.
- **IAM:** Create an IAM user (or OIDC role) with a policy that allows only:  
  - `s3:PutObject`, `s3:DeleteObject` (and list if your sync needs it) on the single bucket.  
  - `cloudfront:CreateInvalidation` on your distribution.  
  No EC2, Lambda, or other services.
- **OIDC (optional but better):** Use GitHub OIDC with AWS so Actions assume a role; no long-lived access keys in GitHub. One-time setup; then no keys to rotate in GitHub.

---

### 2.3 Content and links

- **Links to repos/demos:** Only link to repos (and demos) you’re comfortable being public. No internal or client URLs.
- **Blog:** No PII in posts. If you mention clients, keep it generic (“a nonprofit client”) unless you have permission to name.

---

## 3. Cost efficiency

### 3.1 Hosting (S3 + CloudFront)

- **S3:** Storage and GET requests for a static site are very low cost (fractions of a dollar per month at your traffic).
- **CloudFront:** Free tier covers 1 TB egress and 10M requests/month for 12 months; after that, cost is still small for a personal portfolio.
- **Domain:** Spec says you’re open to a custom domain but don’t want to spend. **Free option:** Keep using the GitHub Pages URL (e.g. `username.github.io/repo`) or the CloudFront URL (e.g. `d1234abcd.cloudfront.net`). **Paid:** Only if you later buy something like `darianlee.com` (~$10–15/year).

**Recommendation for v1:** No custom domain; use CloudFront URL or GitHub Pages URL. Add a custom domain later if you want.

---

### 3.2 Formspree / contact form

- **Formspree:** Free tier is usually 50 submissions/month. Enough for a portfolio. If you exceed, you can add reCAPTCHA to cut spam or switch to “LinkedIn only” for a while.
- **Alternative:** “Contact me on LinkedIn” only = $0 and zero maintenance.

---

### 3.3 Build and CI

- **Static site, no backend:** No server or database costs.
- **GitHub Actions:** Free tier (e.g. 2000 minutes/month) is more than enough for a deploy-on-push workflow.
- **Optional SSG (e.g. 11ty for blog):** Runs in Actions; no extra cost.

---

## 4. Recruiter “hook” without over-sharing

### 4.1 What makes recruiters want to reach out?

- **Clear title and niche:** e.g. “AWS Platform Engineer & DevOps Consultant” (already in your spec).
- **Concrete outcomes:** “94% reduction in manual operations,” “zero fraudulent orders post-resolution,” “reached 4,400+ employees” — use these in Projects/Experience.
- **Proof:** Links to real repos (EKS framework, Secure Cloud Baseline), certifications with names (and logos if you have them), and a short, confident About.
- **One clear CTA:** “Message me” (form or LinkedIn) so they know exactly how to contact you without hunting for an email.

### 4.2 What to avoid

- Don’t dump your full resume text onto the page; keep it scannable (bullets, short paragraphs).
- Don’t show phone/email/address (we covered that above).
- Don’t add dark/light toggle or complex UI; spec’s single dark theme is fine and keeps focus on content.

---

## 5. Checklist before go-live

- [ ] No phone, personal email, or physical address anywhere in the repo or built site.
- [ ] Contact: “Message me” form (Formspree) and/or LinkedIn link only; no `mailto:` with your real email.
- [ ] Formspree (or similar) configured with reCAPTCHA/honeypot; receiving email set in Formspree, not in repo.
- [ ] AWS credentials only in GitHub Actions secrets; IAM least-privilege (S3 + CloudFront only).
- [ ] No secrets or API keys in `_config` or any committed file.
- [ ] If you add analytics later, one-line note (e.g. “This site uses X for analytics”) and minimal script.
- [ ] Resume PDF not hosted publicly unless sanitized (no PII); or link to LinkedIn only.

---

## 6. Summary

| Goal | Action |
|------|--------|
| **Security** | No secrets in repo; GitHub Secrets + minimal IAM; Formspree for form; HTTPS via CloudFront. |
| **Cost** | S3 + CloudFront + Actions free tiers; no domain cost for v1; Formspree free tier or “LinkedIn only.” |
| **Privacy (no PII)** | No phone, email, or address on site; contact via form and/or LinkedIn only. |
| **Recruiter hook** | Strong headline, outcome-focused copy, real projects/certs, single clear CTA to message you. |

If you want, next step can be: (1) add these decisions into `NEW_SITE_QA_AND_SPEC.md` as a “Security & privacy” subsection, or (2) implement the new repo/site with these rules baked in (e.g. no PII in templates, Formspree + LinkedIn in Contact section, and a short README note on secrets and PII).
