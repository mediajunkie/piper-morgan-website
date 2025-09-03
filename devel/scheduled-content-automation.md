# Scheduled Content Updates - GitHub Actions Automation

## Overview
The Piper Morgan website uses GitHub Actions for fully automated scheduled content updates from Medium RSS feeds, ensuring fresh blog content without manual intervention.

## Architecture

### 🔄 Two-Workflow System

1. **`update-blog-posts.yml`** - Fetches and updates Medium content
2. **`deploy.yml`** - Builds and deploys website to GitHub Pages

### 🕒 Scheduling
- **Daily Schedule**: 7:30 PM UTC (11:30 AM Pacific)
- **Manual Trigger**: Available via GitHub Actions UI
- **Auto-trigger**: On blog content updates

## Workflow Details

### 1. Update Medium Blog Posts Workflow

**Triggers:**
- `schedule`: Daily at `30 19 * * *` (7:30 PM UTC)
- `workflow_dispatch`: Manual trigger

**Process:**
1. **Fetch RSS**: Runs `node scripts/fetch-blog-posts.js`
2. **Change Detection**: Only proceeds if new posts found
3. **Commit & Push**: Auto-commits updated `src/data/medium-posts.json`
4. **Trigger Rebuild**: Fires `repository_dispatch: blog-posts-updated`
5. **Error Handling**: Creates GitHub issue on failure

**Permissions:** `contents: write` (for git push)

### 2. Deploy Website Workflow

**Triggers:**
- `push`: On commits to main branch
- `workflow_dispatch`: Manual trigger
- `repository_dispatch`: Auto-triggered by blog updates

**Process:**
1. **Build**: Runs `npm run build` (includes RSS fetch)
2. **Deploy**: Uses `peaceiris/actions-gh-pages@v4`
3. **GitHub Pages**: Publishes to `gh-pages` branch with CNAME
4. **Error Handling**: Creates GitHub issue on failure

## Error Handling & Notifications

### Automatic Issue Creation
Both workflows create detailed GitHub issues on failure:

**Labels Applied:**
- `update-blog-posts.yml`: `bug`, `automation`, `medium-rss`
- `deploy.yml`: `bug`, `deployment`, `github-pages`

**Issue Contents:**
- Workflow run details and links
- Specific error context
- Troubleshooting steps
- Quick action links

### Common Failure Scenarios

1. **Medium RSS Unavailable**
   - **Cause**: Medium API/RSS feed down
   - **Resolution**: Usually temporary, retry manually
   - **Fallback**: Error boundaries show fallback content

2. **Build Failures**
   - **Cause**: TypeScript errors, linting issues
   - **Resolution**: Fix code issues locally, push fixes

3. **Permission Issues** 
   - **Cause**: GitHub token permissions
   - **Resolution**: Verify `contents: write` permission

## Manual Operations

### Manual Trigger Commands
```bash
# Trigger blog update
gh workflow run "Update Medium Blog Posts"

# Trigger deployment
gh workflow run "Deploy Piper Morgan Website to GitHub Pages"

# View recent runs
gh run list --limit 10

# Watch specific run
gh run watch <run-id>
```

### Emergency Deployment
If GitHub Actions fails, use manual deployment:
```bash
./deploy.sh
```

## Monitoring

### Key Metrics
- **Success Rate**: Monitor workflow failure rates
- **Content Freshness**: Latest blog post dates
- **Build Performance**: Build time trends

### Health Checks
- ✅ Daily scheduled runs completing
- ✅ Manual triggers working
- ✅ Auto-deployment on blog updates
- ✅ Error notifications creating issues
- ✅ GitHub Pages deployment succeeding

## Configuration

### Schedule Modification
Edit `.github/workflows/update-blog-posts.yml`:
```yaml
schedule:
  - cron: '30 19 * * *'  # 7:30 PM UTC daily
  # - cron: '0 12 * * 1'  # Mondays at noon UTC (weekly)
```

### Environment Variables
- `GITHUB_TOKEN`: Auto-provided by GitHub Actions
- Custom secrets can be added in repository settings if needed

## Troubleshooting

### Workflow Not Running
1. Check repository Actions settings enabled
2. Verify workflow file syntax with `gh workflow list`
3. Check if repository is active (workflows pause on inactivity)

### Permission Denied Errors
1. Ensure `contents: write` permission in workflow
2. Check repository Actions permissions settings
3. Verify GITHUB_TOKEN has sufficient access

### Build Failures
1. Test local build: `npm run build`
2. Check Medium RSS feed: https://medium.com/feed/building-piper-morgan
3. Review workflow logs for specific errors

## Testing & Verification

### Successful Test Results ✅
- **Manual trigger**: `gh workflow run "Update Medium Blog Posts"` ✅
- **Permissions fix**: Added `contents: write` - no more 403 errors ✅
- **Auto-chain**: Blog update → `repository_dispatch` → deploy ✅
- **Error notifications**: Comprehensive failure issue creation ✅
- **Content freshness**: 10 latest Medium posts successfully fetched ✅

### Performance
- **Blog fetch**: ~30 seconds
- **Full deployment**: ~60 seconds
- **Total automation cycle**: ~90 seconds

## Maintenance

### Regular Tasks
- Monitor scheduled run success rates
- Review and close automation-created issues
- Update dependencies in workflows periodically

### Updates
When modifying workflows:
1. Test changes locally where possible
2. Use `workflow_dispatch` for initial testing
3. Monitor first few scheduled runs after changes
4. Document any configuration changes

---

**Status**: ✅ **PRODUCTION READY** (September 2025)  
**Next Review**: December 2025  
**Maintainer**: Building-in-Public Development Team  

*🤖 Generated with [Claude Code](https://claude.ai/code)*