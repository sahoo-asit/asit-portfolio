# GitHub Pages Deployment Guide

## Deploying to https://sahoo-asit.github.io/asit-portfolio/

### Step 1: Push Code to GitHub Repository

First, ensure your code is pushed to the `sahoo-asit/asit-portfolio` repository:

```bash
cd /Users/asit.sahoo/Documents/GitHub/Personal/asit-portfolio
git add .
git commit -m "Update portfolio with new title, resume, and UI enhancements"
git push origin main
```

### Step 2: Configure GitHub Pages

1. Go to your repository: https://github.com/sahoo-asit/asit-portfolio
2. Click on **Settings** (gear icon)
3. In the left sidebar, click **Pages**
4. Under **Source**, select:
   - **Branch**: `main`
   - **Folder**: `/asit-portfolio-viewer` (or `/ (root)` if you move files)
5. Click **Save**

### Step 3: Important - Fix Base Path for GitHub Pages

Since your HTML files are in the `asit-portfolio-viewer` subfolder, you have two options:

#### Option A: Deploy from Subfolder (Recommended)
Set the GitHub Pages source to deploy from the `asit-portfolio-viewer` folder:
- In Pages settings, if subfolder deployment isn't available, use GitHub Actions

#### Option B: Move Files to Root
Move all files from `asit-portfolio-viewer/` to the repository root:

```bash
cd /Users/asit.sahoo/Documents/GitHub/Personal/asit-portfolio
mv asit-portfolio-viewer/* .
rm -rf asit-portfolio-viewer
git add .
git commit -m "Move files to root for GitHub Pages"
git push origin main
```

#### Option C: Use GitHub Actions (Best for Subfolder)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: 'asit-portfolio-viewer'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Step 4: Verify Deployment

After a few minutes, your site will be live at:
- **URL**: https://sahoo-asit.github.io/asit-portfolio/

### Troubleshooting

1. **404 Error**: Ensure the correct folder is selected in Pages settings
2. **CSS/JS not loading**: Check that all paths are relative (not absolute)
3. **Images not showing**: Verify image files are committed to the repository

### Current Deployment Status

Your portfolio is currently deployed at:
- **Old URL**: https://pm-asit-sahoo.github.io/asit-portfolio/
- **New URL** (after setup): https://sahoo-asit.github.io/asit-portfolio/

### Quick Commands

```bash
# Check git remote
git remote -v

# Add new remote if needed
git remote add origin https://github.com/sahoo-asit/asit-portfolio.git

# Push to new repository
git push -u origin main
```
