# Website Repository Setup Instructions

## ✅ Problem Solved

The GitHub Pages deployment conflict has been resolved by separating the two sites:

- **`pmorgan.tech`** → **Docs from main repository** (restored)
- **`pipermorgan.ai`** → **Website from separate repository** (new)

## 📋 Steps to Complete Setup

### 1. Create New GitHub Repository

1. Go to https://github.com/mediajunkie and create a new repository:
   - **Name**: `piper-morgan-website`
   - **Description**: `Public-facing website for Piper Morgan AI Product Management Assistant`
   - **Visibility**: Public
   - **Initialize**: Do NOT initialize with README (we have our own)

### 2. Upload Website Code

The website code is ready in the `piper-morgan-website/` directory. You need to:

1. **Initialize the new repository**:
   ```bash
   cd piper-morgan-website/
   git init
   git add .
   git commit -m "Initial website implementation

   - Complete Next.js website with 5 pages
   - Component library with atomic design
   - GitHub Pages deployment workflow
   - Static site generation ready
   - SEO and accessibility compliant

   🤖 Generated with [Claude Code](https://claude.ai/code)

   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

2. **Connect to GitHub and push**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/mediajunkie/piper-morgan-website.git
   git push -u origin main
   ```

### 3. Enable GitHub Pages

1. Go to the new repository settings
2. Navigate to **Pages** section
3. **Source**: Deploy from a branch
4. **Branch**: `gh-pages` (will be created automatically by the workflow)
5. **Save**

### 4. Test Deployment

1. The workflow will trigger automatically on first push
2. Check **Actions** tab to monitor deployment
3. Once complete, website will be available at:
   - **GitHub Pages**: https://mediajunkie.github.io/piper-morgan-website/

### 5. Configure Domain (Later)

When ready to go live:
1. In the new repository, go to **Settings → Pages**
2. **Custom domain**: Enter `pipermorgan.ai`
3. **Save** (this creates a CNAME file)
4. Update DNS for `pipermorgan.ai` to point to `mediajunkie.github.io`

## 🎯 Final Result

After setup completion:

- ✅ **`pmorgan.tech`** → Docs site (working again)
- ✅ **`pipermorgan.ai`** → Website from new repo
- ✅ **Clean separation** of concerns
- ✅ **Independent deployments**
- ✅ **No more conflicts**

## 📁 Repository Contents

The `piper-morgan-website/` directory contains:

- ✅ **Complete Next.js website** (5 pages)
- ✅ **Component library** (atomic design)
- ✅ **GitHub Actions workflow** (automatic deployment)
- ✅ **Production-ready configuration**
- ✅ **SEO & accessibility optimized**
- ✅ **Responsive design system**

## 🚀 Ready to Deploy!

The website is complete and ready for deployment to the new repository.
