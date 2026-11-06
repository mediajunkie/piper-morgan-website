#!/bin/bash
# Vercel "Ignored Build Step" (wired in by vercel.json "ignoreCommand").
# Exit 0 = skip this build. Exit 1 = build.
#
# Skip only when EVERY file changed since the last built commit is in a path
# that cannot change what the site serves. Anything else, and any failure to
# work out what changed, builds: a wrongly skipped publish is worse than a
# wasted build.
#
# Safe to skip:  docs/  dev/  .github/  assets-source/  devel/  .serena/
#                tests (src/**/*.test.*)  *.md at the repo root  data/ (root).
# Why data/ is safe: data/blog-metadata.csv is read only by scripts/fetch-blog-posts.js
# (run by hand), and data/editorial-calendar.csv only by the admin pages and compose
# routes, which read the calendar live (loadCalendarLive) and re-copy it at prebuild.
# What a post publish changes (src/data, public/assets) always builds.
#
# Test without Vercel: PIPER_IGNORE_FILES="path1
# path2" bash scripts/vercel-ignore-build.sh

if [ -n "${PIPER_IGNORE_FILES+x}" ]; then
  changed="$PIPER_IGNORE_FILES"
else
  base="${VERCEL_GIT_PREVIOUS_SHA:-}"
  head="${VERCEL_GIT_COMMIT_SHA:-HEAD}"
  if [ -n "$base" ] && git cat-file -e "$base^{commit}" 2>/dev/null; then
    changed=$(git diff --name-only "$base" "$head" 2>/dev/null) || { echo "ignore-build: diff failed, building"; exit 1; }
  else
    changed=$(git diff --name-only HEAD^ HEAD 2>/dev/null) || { echo "ignore-build: no previous commit, building"; exit 1; }
  fi
fi

if [ -z "$changed" ]; then
  echo "ignore-build: could not list changed files, building"
  exit 1
fi

# One pattern per line of the paths that cannot change the site.
skippable='^(docs/|dev/|\.github/|assets-source/|devel/|\.serena/|data/)|^src/.*\.test\.(ts|tsx)$|^[^/]+\.md$'

if echo "$changed" | grep -qvE "$skippable"; then
  echo "ignore-build: a file that can change the site changed, building:"
  echo "$changed" | grep -vE "$skippable" | head -5
  exit 1
fi

echo "ignore-build: only docs, data, tests or notes changed, skipping the build"
exit 0
