#!/bin/bash

# Manual deployment script for Piper Morgan website
echo "🚀 Starting manual deployment..."

# Build the site
echo "📦 Building Next.js site..."
npm run build

# Check if build succeeded
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Create a temporary directory for gh-pages
echo "📁 Preparing gh-pages branch..."
rm -rf /tmp/gh-pages-deploy
mkdir -p /tmp/gh-pages-deploy

# Copy built files
cp -r out/* /tmp/gh-pages-deploy/
echo "pipermorgan.ai" > /tmp/gh-pages-deploy/CNAME
touch /tmp/gh-pages-deploy/.nojekyll

# Initialize git in temp directory
cd /tmp/gh-pages-deploy
git init
git add -A
git commit -m "Deploy website"

# Force push to gh-pages
echo "🚀 Deploying to GitHub Pages..."
git push -f https://github.com/mediajunkie/piper-morgan-website.git main:gh-pages

echo "✅ Deployment complete!"
