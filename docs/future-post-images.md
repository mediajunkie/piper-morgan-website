# Future Post Images

**Date**: 2025-10-11

## Images for Unpublished Posts

These images are staged for posts that haven't been published yet. When these posts are published to Medium and added to the archive, match them with these images:

1. **robot-kitchen** - Future post
2. **robot-100** - Future post
3. **robot-overboard** - Future post
4. **robot-runner** - Future post
5. **robot-party** - Future post
6. **robot-punchbowl** - Future post
7. **robot-ballet** - Future post
8. **robot-guggenheim** - Future post
9. **robot-find** - Future post
10. **robot-filing** - Future post
11. **robot-gag** - Future post
12. **robot-forest** - Future post

## Publishing Workflow

When a new post is published:
1. Add post details to CSV with appropriate cartoon name
2. Run `node scripts/match-blog-images.js --copy` to copy image
3. Run `node scripts/update-post-thumbnails.js` to update JSON
4. Deploy changes

---

_These images remain in source/ until posts are published_
