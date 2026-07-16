/**
 * GitHub Contents API access to editorial drafts in piper-morgan-product.
 *
 * Active when GITHUB_DRAFT_TOKEN is set — the deployed (Vercel) path, where
 * no sibling product-repo checkout exists. Without a token, the compose API
 * falls back to the local filesystem (dev on PM's machine).
 *
 * Every save is a direct commit to the configured branch, authored by the
 * token's owner. Uses the file SHA for optimistic concurrency: a stale SHA
 * surfaces as DraftConflictError rather than silently overwriting.
 */

interface GitHubDraftConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

const API_ROOT = 'https://api.github.com';

export function githubDraftsEnabled(): boolean {
  return Boolean(process.env.GITHUB_DRAFT_TOKEN);
}

function config(): GitHubDraftConfig {
  const token = process.env.GITHUB_DRAFT_TOKEN;
  if (!token) throw new Error('GITHUB_DRAFT_TOKEN is not set');
  return {
    token,
    owner: process.env.GITHUB_DRAFT_OWNER || 'mediajunkie',
    repo: process.env.GITHUB_DRAFT_REPO || 'piper-morgan-product',
    branch: process.env.GITHUB_DRAFT_BRANCH || 'main',
  };
}

function contentsUrl(cfg: GitHubDraftConfig, draftPath: string): string {
  const encodedPath = draftPath.split('/').map(encodeURIComponent).join('/');
  return `${API_ROOT}/repos/${cfg.owner}/${cfg.repo}/contents/${encodedPath}`;
}

function ghFetch(url: string, cfg: GitHubDraftConfig, init?: RequestInit): Promise<Response> {
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init?.headers ?? {}),
    },
  });
}

export class DraftNotFoundError extends Error {}

/** Save rejected because the file changed since it was read (stale SHA). */
export class DraftConflictError extends Error {}

export async function fetchDraft(draftPath: string): Promise<{ content: string; sha: string }> {
  const cfg = config();
  const res = await ghFetch(`${contentsUrl(cfg, draftPath)}?ref=${encodeURIComponent(cfg.branch)}`, cfg);
  if (res.status === 404) {
    throw new DraftNotFoundError(`Draft not found in ${cfg.owner}/${cfg.repo}@${cfg.branch}: ${draftPath}`);
  }
  if (!res.ok) {
    throw new Error(`GitHub read failed (HTTP ${res.status}): ${(await res.text()).slice(0, 300)}`);
  }
  const data = (await res.json()) as { content?: string; encoding?: string; sha?: string };
  if (typeof data.content !== 'string' || data.encoding !== 'base64' || !data.sha) {
    throw new Error(`Unexpected GitHub contents response for ${draftPath} (is it a directory or >1 MB?)`);
  }
  return { content: Buffer.from(data.content, 'base64').toString('utf-8'), sha: data.sha };
}

export async function saveDraft(
  draftPath: string,
  content: string,
  sha: string,
  message: string,
): Promise<{ sha: string }> {
  const cfg = config();
  const res = await ghFetch(contentsUrl(cfg, draftPath), cfg, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, 'utf-8').toString('base64'),
      sha,
      branch: cfg.branch,
    }),
  });
  if (res.status === 409) {
    throw new DraftConflictError(
      `Draft changed on GitHub since it was loaded: ${draftPath}. Reload before saving.`,
    );
  }
  if (res.status === 404) {
    throw new DraftNotFoundError(`Draft not found in ${cfg.owner}/${cfg.repo}@${cfg.branch}: ${draftPath}`);
  }
  if (!res.ok) {
    throw new Error(`GitHub write failed (HTTP ${res.status}): ${(await res.text()).slice(0, 300)}`);
  }
  const data = (await res.json()) as { content?: { sha?: string } };
  if (!data.content?.sha) {
    throw new Error(`GitHub write succeeded but no new SHA returned for ${draftPath}`);
  }
  return { sha: data.content.sha };
}

/**
 * Upload a binary file (a draft's source image) to the repo. Unlike saveDraft,
 * this creates a NEW file and doesn't need the caller to already hold a SHA —
 * if a file already exists at filePath, the write is rejected (409) rather
 * than silently overwritten, since there's no prior read to base a conflict
 * check on.
 */
export async function uploadBinaryFile(
  filePath: string,
  base64Content: string,
  message: string,
): Promise<{ sha: string }> {
  const cfg = config();
  const res = await ghFetch(contentsUrl(cfg, filePath), cfg, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, content: base64Content, branch: cfg.branch }),
  });
  if (res.status === 422 || res.status === 409) {
    throw new DraftConflictError(`A file already exists at ${filePath} — choose a different name.`);
  }
  if (!res.ok) {
    throw new Error(`GitHub upload failed (HTTP ${res.status}): ${(await res.text()).slice(0, 300)}`);
  }
  const data = (await res.json()) as { content?: { sha?: string } };
  if (!data.content?.sha) {
    throw new Error(`GitHub upload succeeded but no SHA returned for ${filePath}`);
  }
  return { sha: data.content.sha };
}
