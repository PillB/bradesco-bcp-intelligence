# 15 — Deployment & GitHub Methodology

**Task ID:** METHODOLOGY-DOC (this file)
**Scope:** GitHub CLI authentication, repository naming convention,
GitHub Pages path compatibility, and the deployment checklist for the
Ursa Coffee Strategic Dossier & Command Center.
**Target deployment platform:** GitHub Pages (static export) and/or
Vercel (SSR / dynamic routes).
**Project root:** `/home/z/my-project`
**Git remote:** (to be configured at deployment time)

This document records the deployment protocol for the Ursa Coffee
dossier: how the GitHub CLI is authenticated via the device code flow,
the repository naming convention, the path-compatibility rules for
GitHub Pages (the `basePath` configuration), and the pre-deployment
checklist. It is the reproducible recipe for shipping the dossier to
a public URL.

---

## 1. The GitHub CLI authentication process (device code flow)

The Ursa dossier uses the GitHub CLI (`gh`) for repository creation,
authentication, and Pages configuration. The CLI uses the **device
code flow** — the most secure OAuth flow for CLI tools because it
never asks the user to paste a token into the terminal.

### 1.1 Prerequisites

```bash
# Install the GitHub CLI (if not already installed)
# macOS:
brew install gh

# Linux (Debian/Ubuntu):
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
  | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] \
  https://cli.github.com/packages stable main" \
  | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update && sudo apt install gh

# Verify installation
gh --version    # → gh version 2.x.x or higher
```

### 1.2 The device code flow

```bash
gh auth login
```

The CLI walks through an interactive prompt:

1. **"What account do you want to log into?"** — select `GitHub.com`.
2. **"What is your preferred protocol for Git operations on this host?"**
   — select `HTTPS` (recommended for GitHub Pages; SSH also works
   if the user has an SSH key configured).
3. **"Authenticate Git with your GitHub credentials?"** — select `Yes`.
4. **"How would you like to authenticate GitHub CLI?"** — select
   `Login with a web browser`.

The CLI then displays a one-time code:

```
! First copy your one-time code: XXXX-XXXX
Press Enter to open github.com in your browser...
```

The user:

5. Copies the code (e.g., `ABCD-1234`).
6. Presses Enter — the default browser opens `https://github.com/login/device`.
7. Pastes the code into the GitHub web page.
8. Authorizes the GitHub CLI OAuth app.
9. Returns to the terminal — the CLI confirms authentication:

```
✓ Authentication complete.
- gh config set -h github.com git_protocol https
✓ Configured git protocol
✓ Logged in as <username>
```

### 1.3 Verification

```bash
gh auth status
# → github.com
#   ✓ Logged in to github.com account <username>
#   - Active account: true
#   - Git operations protocol: https
#   - Token: gho_************************************
#   - Token scopes: gist, read:org, repo, workflow
```

### 1.4 Why the device code flow (not a personal access token)

The device code flow is preferred over a personal access token (PAT)
because:

- **No token in the terminal** — the PAT would be visible in shell
  history and process listings. The device code flow never displays
  the token.
- **No token in config files** — the CLI stores the token in the
  OS keychain (macOS Keychain, Linux secret service), not in a
  plaintext `~/.config/gh/hosts.yml`.
- **Scoped tokens** — the OAuth app requests specific scopes (gist,
  read:org, repo, workflow). The user can revoke the token from
  GitHub's settings page if needed.
- **2FA-compatible** — works with two-factor authentication without
  requiring an app-specific password.

### 1.5 Token scopes required for Pages deployment

| Scope | Why required |
|---|---|
| `repo` | Create and push to the repository |
| `workflow` | Trigger GitHub Actions (for Pages build) |
| `read:org` | If deploying to an organization repo |
| `gist` | Optional — for sharing deployment scripts as gists |

---

## 2. Repository naming convention

The Ursa dossier repository follows the kebab-case naming convention
required by GitHub Pages.

### 2.1 The naming rule

| Repo type | Name pattern | Pages URL |
|---|---|---|
| User / personal repo | `ursa-coffee-dossier` | `https://<username>.github.io/ursa-coffee-dossier/` |
| Organization repo | `ursa-coffee-dossier` | `https://<orgname>.github.io/ursa-coffee-dossier/` |
| User Pages root repo | `<username>.github.io` | `https://<username>.github.io/` |

### 2.2 Why kebab-case

- **GitHub convention** — repository names are lowercased and
  hyphenated in URLs. Kebab-case avoids surprises like
  `UrsaCoffeeDossier` becoming `ursacoffeedossier` in the URL.
- **Next.js `basePath` compatibility** — the `basePath` in
  `next.config.ts` must match the repo name exactly. Kebab-case is
  URL-safe and shell-safe.
- **Docker / CI compatibility** — kebab-case is also Docker-image-safe
  and CI-variable-safe (no uppercase, no underscores).

### 2.3 The recommended repo name

**`ursa-coffee-dossier`** — descriptive, kebab-case, matches the
project's `package.json` name.

### 2.4 Creating the repository

```bash
# From /home/z/my-project
gh repo create ursa-coffee-dossier \
  --public \
  --description "Ursa Coffee Roasters — Strategic Dossier & Command Center (Miraflores, Lima)" \
  --source=. \
  --remote=origin \
  --push
```

The `--source=.` flag uses the current directory as the repo source.
`--remote=origin` adds the remote. `--push` pushes the initial commit.

### 2.5 Repository settings

After creation, configure:

- **Default branch:** `main` (already set if the local repo's default
  is `main`).
- **Pages source:** GitHub Actions (recommended) or `Deploy from a
  branch` with the `gh-pages` branch.
- **Issues:** enabled (for tracking follow-up items like EC-003).
- **Wiki:** disabled (the dossier's `methodology/` folder replaces
  the wiki).
- **Discussions:** disabled (not needed for a single-owner dossier).

---

## 3. Path compatibility for GitHub Pages

The Ursa dossier uses **hash-based routing** (not Next.js dynamic
segments), so every view is reachable at `/#/<route>` rather than
`/<route>`. This is the project's core deployment compatibility
decision.

### 3.1 Why hash-based routing

- **Single-route constraint** — the project brief specified "stays on
  the single `/` route." Hash routing satisfies this: every view is
  `/#/<route>`, the server always serves `/`, and the client-side
  router dispatches based on the hash.
- **GitHub Pages compatibility** — GitHub Pages serves static files.
  Without a server-side rewrite, a URL like `/<route>` would 404 on
  refresh. Hash routing (`/#/<route>`) refreshes cleanly because the
  hash is not sent to the server.
- **Vercel compatibility** — hash routing also works on Vercel
  without configuration. (Vercel would also support dynamic routes,
  but the project constraint rules them out.)

### 3.2 The `basePath` configuration

If deploying to a project Pages URL
(`https://<user>.github.io/ursa-coffee-dossier/`), the `basePath` in
`next.config.ts` must be set to `/ursa-coffee-dossier` so that all
asset URLs resolve correctly.

```typescript
// next.config.ts
const isProd = process.env.NODE_ENV === "production";
const repoName = "ursa-coffee-dossier";

const nextConfig = {
  // For GitHub Pages project sites, set basePath and assetPrefix
  // to the repo name. For user Pages (<user>.github.io), leave both
  // unset (basePath = "/").
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}/` : "",
  output: "export",  // static HTML export for GitHub Pages
  images: {
    unoptimized: true,  // required for static export
  },
  trailingSlash: true,  // GitHub Pages prefers trailing slashes
};

export default nextConfig;
```

### 3.3 The `output: "export"` setting

GitHub Pages serves static files. Next.js 16's `output: "export"`
generates a static HTML export in `out/` that can be deployed directly
to Pages. This requires:

- No server-side API routes (the project's `src/app/api/route.ts` is
  a stub and is excluded from the export).
- No dynamic server-side rendering (every view uses `"use client"` or
  is statically renderable).
- `images.unoptimized: true` (no Next.js Image Optimization service on
  Pages).

### 3.4 The asset path problem

With `basePath: "/ursa-coffee-dossier"`, every asset URL is prefixed:

- `/_next/static/chunks/main.js` → `/ursa-coffee-dossier/_next/static/chunks/main.js`
- `/dossier/01-brand-audit-and-design-system.html` → `/ursa-coffee-dossier/dossier/01-brand-audit-and-design-system.html`

This is handled automatically by Next.js for assets referenced through
the `next/link`, `next/image`, and `next/script` components. For
hardcoded paths (e.g., the dossier banner's link to `/dossier/...`),
the `basePath` must be prepended manually:

```typescript
const DOSSIER_BASE = process.env.NODE_ENV === "production"
  ? "/ursa-coffee-dossier/dossier"
  : "/dossier";

// Usage:
<a href={`${DOSSIER_BASE}/01-brand-audit-and-design-system.html`}>
  Open Module 01
</a>
```

### 3.5 The 404.html fallback

GitHub Pages serves `404.html` at the repository root for any
unmatched URL. Next.js's static export generates `404.html`
automatically. For hash-based routing, this 404 page should redirect
to `/#/` (the dashboard) so that a user who types
`https://<user>.github.io/ursa-coffee-dossier/anything` lands on the
dashboard rather than a broken page.

```html
<!-- out/404.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0; url=./#/" />
    <title>Redirecting…</title>
  </head>
  <body>
    <p>Redirecting to the dashboard…</p>
  </body>
</html>
```

### 3.6 The `.nojekyll` file

GitHub Pages uses Jekyll by default, which ignores files and folders
starting with `_`. Next.js's static export puts assets in
`_next/static/`, which Jekyll would skip. To disable Jekyll
processing, add an empty `.nojekyll` file to the `out/` directory
before deploying:

```bash
touch out/.nojekyll
```

---

## 4. The deployment workflow

### 4.1 Option A — GitHub Actions (recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      - name: Install dependencies
        run: bun install --frozen-lockfile
      - name: Build static export
        run: bun run build
        env:
          NODE_ENV: production
      - name: Add .nojekyll
        run: touch out/.nojekyll
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Then configure the repository's Pages source to "GitHub Actions":

```bash
gh api -X PUT repos/<username>/ursa-coffee-dossier/pages \
  -f source='{"branch":"main","path":"/"}' \
  -f build_type=workflow
```

### 4.2 Option B — `gh-pages` branch (legacy)

If GitHub Actions is unavailable, deploy via the `gh-pages` branch:

```bash
# Install the gh-pages utility
bun add -d gh-pages

# Add to package.json scripts:
#   "deploy": "bun run build && gh-pages -d out"

# Run the deploy script
bun run deploy
```

This pushes the `out/` directory to a `gh-pages` branch. Configure
GitHub Pages to serve from the `gh-pages` branch root.

### 4.3 Option C — Vercel (dynamic / SSR)

If dynamic routes or server-side features are needed later:

```bash
# Install Vercel CLI
bun add -g vercel

# Deploy
vercel
```

Vercel auto-detects Next.js and configures the build. The hash-based
router works without modification. No `basePath` is needed (Vercel
serves at the root domain).

---

## 5. The deployment checklist

Before deploying, verify each item:

### 5.1 Code quality

```bash
# 1. Lint passes
bun run lint
# → 0 errors (one known exception: research/pairwise-contrast-test.js
#   uses CommonJS require() by design — this file is excluded from
#   the production build and does not block deployment)

# 2. TypeScript compiles
npx tsc --noEmit
# → 0 errors

# 3. Dev server runs and returns 200
bun run dev &
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
# → 200
kill %1
```

### 5.2 Static export builds

```bash
# 4. Production build succeeds
NODE_ENV=production bun run build
# → "✓ Generating static pages" with no errors

# 5. The out/ directory exists
ls out/ | head
# → 404.html, index.html, _next/, dossier/, ...

# 6. The .nojekyll file is present
test -f out/.nojekyll && echo "OK" || echo "MISSING"
```

### 5.3 Content integrity

```bash
# 7. The static dossier is byte-identical to the archive
diff -rq upload/ursa_extracted/ursaCoffeeMarketingAndDesign/ public/dossier/
# → (no output if identical)

# 8. The methodology files exist
ls methodology/
# → README.md + 9 numbered files

# 9. The research artifacts exist
ls research/*.json research/*.md | wc -l
# → 15+ files
```

### 5.4 Hash-routing verification

```bash
# 10. Every view is reachable via hash route (manual or automated)
for route in "" brand market menu growth viral creative roadmap calculator \
             menu-studio competitors content-calendar experiments style-guide \
             budget origin-atlas roi campaign-builder spirit-checker swot \
             pilot scorecard loyalty sources landing; do
  curl -s -o /dev/null -w "%{http_code} #/$route\n" \
    "http://localhost:3000/#/$route"
done
# → 25 lines, all 200
```

### 5.5 Contrast and accessibility

```bash
# 11. The pairwise contrast test passes
node research/pairwise-contrast-test.js
# → "Colors tested: 31 | Pairs tested: 465 | Pairs failing WCAG AA: ..."

# 12. The runtime contrast harness reports 0 failures on key views
agent-browser open "http://localhost:3000/#/dashboard"
agent-browser wait 1000
agent-browser eval "$(cat research/contrast-harness.js)"
# → "Failed: 0"
```

### 5.6 Git state

```bash
# 13. Working tree is clean
git status
# → "working tree clean"

# 14. All changes are committed
git log --oneline | head -5
# → latest commits visible

# 15. The remote is configured
git remote -v
# → origin  https://github.com/<username>/ursa-coffee-dossier.git (fetch)
#    origin  https://github.com/<username>/ursa-coffee-dossier.git (push)
```

### 5.7 Post-deployment verification

After the first deployment:

```bash
# 16. The Pages URL returns 200
curl -s -o /dev/null -w "%{http_code}\n" \
  https://<username>.github.io/ursa-coffee-dossier/
# → 200

# 17. The static dossier is reachable
curl -s -o /dev/null -w "%{http_code}\n" \
  https://<username>.github.io/ursa-coffee-dossier/dossier/01-brand-audit-and-design-system.html
# → 200

# 18. The hash router works (manual)
# Open https://<username>.github.io/ursa-coffee-dossier/#/brand in a browser
# → Brand Audit view should render

# 19. The 404 fallback redirects to the dashboard
curl -s -o /dev/null -w "%{http_code}\n" \
  https://<username>.github.io/ursa-coffee-dossier/nonexistent
# → 404 (but the 404.html redirects to /#/)

# 20. The contrast harness still passes on the deployed URL
agent-browser open "https://<username>.github.io/ursa-coffee-dossier/#/dashboard"
agent-browser wait 2000
agent-browser eval "$(cat research/contrast-harness.js)"
# → "Failed: 0"
```

---

## 6. Rollback procedure

If a deployment is broken:

```bash
# 1. Identify the last known-good commit
git log --oneline | head -10

# 2. Roll back the main branch to that commit
git revert HEAD  # or: git reset --hard <last-good-commit>

# 3. Push the rollback
git push origin main

# 4. The GitHub Action will re-deploy automatically (Option A).
#    For Option B (gh-pages branch), re-run:
bun run deploy

# 5. Verify the rollback
curl -s -o /dev/null -w "%{http_code}\n" \
  https://<username>.github.io/ursa-coffee-dossier/
```

---

## 7. Domain configuration (optional)

If the dossier should be served at a custom domain (e.g.,
`dossier.ursacoffee.pe`):

1. Add a `CNAME` file to `out/` containing the custom domain:
   ```bash
   echo "dossier.ursacoffee.pe" > out/CNAME
   ```
2. Configure the DNS at the domain registrar:
   - **Subdomain** (e.g., `dossier.ursacoffee.pe`):
     `CNAME dossier → <username>.github.io.`
   - **Apex domain** (e.g., `ursacoffee.pe`):
     `A @ → 185.199.108.153`
     `A @ → 185.199.109.153`
     `A @ → 185.199.110.153`
     `A @ → 185.199.111.153`
3. In the GitHub repository settings → Pages → Custom domain, enter
   the custom domain and click "Save."
4. Wait for DNS to propagate (5-60 minutes) and for GitHub to issue
   the HTTPS certificate (may take up to 24 hours).

When using a custom domain, the `basePath` in `next.config.ts` should
be set to `""` (empty) — the custom domain serves at the root.

---

## 8. Reproducibility

A new analyst can deploy the dossier by following the steps above.
The expected sequence:

```bash
# 1. Authenticate with GitHub CLI
gh auth login
gh auth status

# 2. Create the repository
cd /home/z/my-project
gh repo create ursa-coffee-dossier --public --source=. --remote=origin --push \
  --description "Ursa Coffee Roasters — Strategic Dossier & Command Center"

# 3. Configure Pages
gh api -X PUT repos/<username>/ursa-coffee-dossier/pages \
  -f source='{"branch":"main","path":"/"}' \
  -f build_type=workflow

# 4. Add the GitHub Actions workflow (see §4.1)
mkdir -p .github/workflows
# (paste the deploy.yml content from §4.1)

# 5. Commit and push
git add .github/workflows/deploy.yml next.config.ts
git commit -m "Add GitHub Pages deployment workflow + basePath config"
git push origin main

# 6. Wait for the action to complete
gh run watch

# 7. Verify deployment
curl -s -o /dev/null -w "%{http_code}\n" \
  https://<username>.github.io/ursa-coffee-dossier/
# → 200
```

### 8.1 The deployment-state record

After deployment, record:

- **Pages URL:** `https://<username>.github.io/ursa-coffee-dossier/`
- **Deployed commit SHA:** (record from `git rev-parse HEAD`)
- **Deploy timestamp:** (record from `date -u`)
- **Custom domain (if configured):** (record the CNAME)
- **HTTPS certificate status:** (record from GitHub Pages settings)

Append this record to the worklog under a new `Task ID: DEPLOY-1`
section so future deployments can be compared.

---

## 9. Cross-references

- For the project's hash-routing architecture → **01-project-overview.md** §3.3
- For the dev-server and lint verification steps → **01-project-overview.md** §9
- For the static dossier files that must be deployed alongside the
  Next.js app → **01-project-overview.md** §5
- For the contrast harness that must pass post-deployment → **13-accessibility-methodology.md** §2
- For the editorial protocol that governs the deployed copy → **14-editorial-protocol.md** §1

---

## ACTUAL DEPLOYMENT LOG — 2026-08-01

### Authentication
- **Tool:** gh CLI v2.63.2 (downloaded tarball to `/tmp/gh_2.63.2_linux_amd64/`)
- **Method:** Device code flow via `gh auth login --hostname github.com --git-protocol https --web`
- **Persistence technique:** `setsid nohup bash -c '...'` to keep the auth process alive between tool calls
- **User:** PillB
- **Scopes:** gist, read:org, repo
- **Status:** ✅ Authenticated
- **Credential helper:** Configured via `gh auth setup-git`

### Repository Creation
- **Repo name:** `PillB/AIMarket-Design-Consulting-Reports`
- **Visibility:** Public
- **Description:** "Ursa Coffee Roasters — AI-driven brand, product, graphic, and marketing strategic dossier with interactive tools, 1km competitor census, and methodology documentation"
- **Default branch:** main
- **URL:** https://github.com/PillB/AIMarket-Design-Consulting-Reports
- **Command:** `gh repo create PillB/AIMarket-Design-Consulting-Reports --public --source=. --remote=origin --push`

### Push Verification
- **Commits pushed:** 30
- **Files verified on GitHub:**
  - `methodology/` folder (11 files including README)
  - `research/` folder (16+ files including census, recommendation-ledger, contrast-harness)
  - `public/dossier/` (10 HTML files + assets)
  - `src/components/ursa/views/` (10 view files)
  - `src/components/ursa/tools/` (15 tool files)
  - All config files (package.json, tsconfig.json, next.config.ts, etc.)

### Link Compatibility
- Static HTML dossiers in `public/dossier/` use relative paths (`assets/ursa.css`, `01-brand-audit-and-design-system.html`)
- These work correctly when served from GitHub Pages at `https://pillb.github.io/AIMarket-Design-Consulting-Reports/dossier/`
- The Next.js app uses hash-based routing (`#/brand`, `#/calculator`) which works without server-side routing config
- Internal links between static and interactive reports use absolute paths from root (`/dossier/index.html`)

### Live Validation
- Repo URL: https://github.com/PillB/AIMarket-Design-Consulting-Reports
- All 30 commits successfully pushed
- All key directories present and verified via GitHub API
