/**
 * @jest-environment node
 *
 * API-level checks for `POST /api/compose?slug=…&action=title` (website#44), in both storage
 * modes. Filesystem mode runs against a throwaway git repo; GitHub mode against a stateful
 * in-memory stand-in for the Contents API (sha-checked PUT, injectable races).
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from 'child_process';
import type { NextApiRequest, NextApiResponse } from 'next';

jest.mock('@/lib/admin-auth', () => ({ ensureAdmin: async () => true }));

const CAL_REL = 'docs/internal/planning/comms/editorial-calendar.csv';
const SNAPSHOT = fs.readFileSync(path.join(process.cwd(), 'data', 'editorial-calendar.csv'), 'utf-8');

function pickRow() {
  const { parse } = require('csv-parse/sync') as typeof import('csv-parse/sync'); // eslint-disable-line @typescript-eslint/no-require-imports
  const all = parse(SNAPSHOT, { columns: true, skip_empty_lines: true, relax_quotes: true, relax_column_count: true }) as Record<string, string>[];
  const counts = new Map<string, number>();
  all.forEach(r => r.draftPath && counts.set(r.draftPath, (counts.get(r.draftPath) ?? 0) + 1));
  const row = all.find(r => r.draftPath && counts.get(r.draftPath) === 1)!;
  return { draftPath: row.draftPath, slug: path.basename(row.draftPath, '.md'), title: row.title };
}

function call(handler: (q: NextApiRequest, s: NextApiResponse) => Promise<unknown>, slug: string, body: unknown) {
  const out: { status: number; json: any } = { status: 0, json: null }; // eslint-disable-line @typescript-eslint/no-explicit-any
  const res = {
    status(c: number) { out.status = c; return this; },
    json(j: unknown) { out.json = j; return this; },
  } as unknown as NextApiResponse;
  const req = { method: 'POST', query: { slug, action: 'title' }, body } as unknown as NextApiRequest;
  return handler(req, res).then(() => out);
}

async function loadHandler() {
  jest.resetModules();
  return (await import('@/pages/api/compose')).default;
}

describe('title rename — filesystem mode', () => {
  let root: string;
  const { draftPath, slug, title } = pickRow();

  beforeEach(() => {
    delete process.env.GITHUB_DRAFT_TOKEN;
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'compose-title-'));
    process.env.PIPER_PRODUCT_ROOT = root;
    fs.mkdirSync(path.dirname(path.join(root, CAL_REL)), { recursive: true });
    fs.writeFileSync(path.join(root, CAL_REL), SNAPSHOT);
    const git = (a: string) => execSync(`git -C "${root}" ${a}`, { stdio: 'pipe' });
    git('init -q');
    git('config user.email t@example.com');
    git('config user.name t');
    git(`add ${CAL_REL}`);
    git('commit -q -m seed');
  });
  afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

  it('changes exactly one line of the calendar and commits only that file', async () => {
    const handler = await loadHandler();
    const out = await call(handler, slug, { title: `${title} (renamed, "v2")` });
    expect(out.status).toBe(200);
    expect(out.json).toMatchObject({ saved: true, changed: true, committed: true });

    const after = fs.readFileSync(path.join(root, CAL_REL), 'utf-8').split('\n');
    const before = SNAPSHOT.split('\n');
    expect(after).toHaveLength(before.length);
    const diff = after.filter((l, i) => l !== before[i]);
    expect(diff).toHaveLength(1);
    expect(diff[0]).toContain(draftPath);
    expect(execSync(`git -C "${root}" log -1 --format=%s`).toString().trim())
      .toBe(`content(${slug}): rename calendar title via admin UI`);
  });

  it('writes and commits nothing when the title is unchanged', async () => {
    const handler = await loadHandler();
    const out = await call(handler, slug, { title });
    expect(out.json).toMatchObject({ saved: true, changed: false });
    expect(fs.readFileSync(path.join(root, CAL_REL), 'utf-8')).toBe(SNAPSHOT);
    expect(execSync(`git -C "${root}" rev-list --count HEAD`).toString().trim()).toBe('1');
  });

  it.each([['', 'empty'], ['   ', 'blank'], ['two\nlines', 'multiline'], ['x'.repeat(301), 'too long']])(
    'rejects an invalid title (%#: %s)', async (bad) => {
      const handler = await loadHandler();
      expect((await call(handler, slug, { title: bad })).status).toBe(400);
      expect(fs.readFileSync(path.join(root, CAL_REL), 'utf-8')).toBe(SNAPSHOT);
    });

  it('404s for an unknown slug', async () => {
    const handler = await loadHandler();
    expect((await call(handler, 'no-such-draft', { title: 'x' })).status).toBe(404);
  });
});

describe('title rename — GitHub mode', () => {
  const { draftPath, slug, title } = pickRow();
  let csv: string;
  let sha: number;
  let puts: { body: any }[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  let raceOnPuts: number;
  const realFetch = global.fetch;

  beforeEach(() => {
    process.env.GITHUB_DRAFT_TOKEN = 'test-token-not-real';
    csv = SNAPSHOT; sha = 1; puts = []; raceOnPuts = 0;
    global.fetch = jest.fn(async (url: string, init?: RequestInit) => {
      if (!String(url).includes(`/contents/${CAL_REL}`)) return { ok: false, status: 404, text: async () => '', json: async () => ({}) };
      if (init?.method === 'PUT') {
        const body = JSON.parse(init.body as string);
        puts.push({ body });
        if (raceOnPuts > 0) {
          raceOnPuts--;
          csv = csv.replace(/\n$/, '\n'); sha++;
          return { ok: false, status: 409, text: async () => 'conflict', json: async () => ({}) };
        }
        if (body.sha !== String(sha)) return { ok: false, status: 409, text: async () => 'stale', json: async () => ({}) };
        csv = Buffer.from(body.content, 'base64').toString('utf-8'); sha++;
        return { ok: true, status: 200, json: async () => ({ content: { sha: String(sha) } }) };
      }
      return { ok: true, status: 200, json: async () => ({ content: Buffer.from(csv).toString('base64'), encoding: 'base64', sha: String(sha) }) };
    }) as unknown as typeof fetch;
  });
  afterEach(() => { global.fetch = realFetch; delete process.env.GITHUB_DRAFT_TOKEN; });

  it('PUTs the one-line change with the sha it just read', async () => {
    const handler = await loadHandler();
    const out = await call(handler, slug, { title: 'Brand new title' });
    expect(out.status).toBe(200);
    expect(puts).toHaveLength(1);
    expect(puts[0].body.sha).toBe('1');
    expect(puts[0].body.message).toBe(`content(${slug}): rename calendar title via admin UI`);
    const changed = csv.split('\n').filter((l, i) => l !== SNAPSHOT.split('\n')[i]);
    expect(changed).toHaveLength(1);
    expect(changed[0]).toContain(draftPath);
    expect(changed[0].startsWith('Brand new title,')).toBe(true);
  });

  it('retries once on a race and succeeds against the fresh content', async () => {
    raceOnPuts = 1;
    const handler = await loadHandler();
    const out = await call(handler, slug, { title: 'After race' });
    expect(out.status).toBe(200);
    expect(puts).toHaveLength(2);
    expect(puts[1].body.sha).toBe('2');
  });

  it('returns 409 with a clear message when the race repeats', async () => {
    raceOnPuts = 5;
    const handler = await loadHandler();
    const out = await call(handler, slug, { title: 'Never lands' });
    expect(out.status).toBe(409);
    expect(out.json.error).toMatch(/changed on GitHub/);
    expect(puts).toHaveLength(2);
  });

  it('does not PUT when the title is unchanged', async () => {
    const handler = await loadHandler();
    const out = await call(handler, slug, { title });
    expect(out.json).toMatchObject({ changed: false });
    expect(puts).toHaveLength(0);
  });
});
