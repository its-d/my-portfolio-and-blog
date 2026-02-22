# Giscus setup (blog comments)

You already have **Discussions** on. Do these steps once:

## 1. Install the Giscus app

- Go to **https://github.com/apps/giscus**
- Click **Install** and choose your account (or the org that owns the repo)
- Select **Only select repositories** and pick this repo (e.g. `its-d.github.io`), then **Install**

Without this, visitors can’t post comments.

## 2. Get your repo and category IDs

- Go to **https://giscus.app**
- In **Repository**, enter your repo (e.g. `its-d/its-d.github.io`)
- Pick **Page ↔️ Discussions mapping**: “Discussion title contains page pathname” (or “page URL” if you prefer)
- Under **Discussion category**, choose an existing category (e.g. “Announcements”) or create one in the repo’s Discussions → New category
- The page will show a script snippet with **data-repo-id** and **data-category-id**

## 3. Put the IDs in this repo

Edit **`_data/giscus.json`**:

- Set **`repo`** to your repo (e.g. `its-d/its-d.github.io`)
- Replace **`REPLACE_WITH_REPO_ID`** with the value from giscus.app (e.g. `R_kgDO...`)
- Replace **`REPLACE_WITH_CATEGORY_ID`** with the category ID (e.g. `DIC_kwDO...`)

Save and rebuild. Comments will load on blog posts; you moderate in GitHub **Discussions** for this repo.
