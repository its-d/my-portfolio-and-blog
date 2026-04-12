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
2. Open each badge > "Share" > download the badge image (PNG, ~600x600)
3. Rename to match the filenames above
4. Place in this directory
5. While there, copy the public verification URL for each badge and paste into the matching `credlyUrl` field in `_data/certifications.json`

Until these are populated, the certifications section renders a text fallback per cert (handled by `certifications.njk`).
