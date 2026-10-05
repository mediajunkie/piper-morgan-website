import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { setCalendarTitle, encodeCsvField } from './calendar-title';

const HEADER = 'title,theme,status,pubDate,draftPath,notes';
const csv = (...rows: string[]) => [HEADER, ...rows].join('\n') + '\n';
const rows = (text: string) =>
  parse(text, { columns: true, skip_empty_lines: true, relax_quotes: true }) as Record<string, string>[];

const A = 'Alpha post,building,queued,2026-10-10,docs/drafts/alpha.md,';
const B = '"Beta, with comma",insight,drafted,2026-10-17,docs/drafts/beta.md,"a ""note"""';
const C = 'Gamma,ship,drafted,,docs/drafts/gamma.md,';

describe('setCalendarTitle', () => {
  it('changes only the matched row, leaving every other byte identical', () => {
    const text = csv(A, B, C);
    const r = setCalendarTitle(text, 'docs/drafts/alpha.md', 'Alpha, renamed');
    expect(r.kind).toBe('updated');
    if (r.kind !== 'updated') return;
    expect(r.text).toBe(csv('"Alpha, renamed",building,queued,2026-10-10,docs/drafts/alpha.md,', B, C));
    expect(rows(r.text)[0].title).toBe('Alpha, renamed');
    expect(rows(r.text)[1]).toEqual(rows(text)[1]);
    expect(rows(r.text)[2]).toEqual(rows(text)[2]);
  });

  it('matches a row whose title and notes are quoted with commas and escaped quotes', () => {
    const r = setCalendarTitle(csv(A, B, C), 'docs/drafts/beta.md', 'Beta');
    expect(r.kind).toBe('updated');
    if (r.kind !== 'updated') return;
    expect(r.text).toBe(csv(A, 'Beta,insight,drafted,2026-10-17,docs/drafts/beta.md,"a ""note"""', C));
  });

  it('round-trips quotes inside a new title', () => {
    const r = setCalendarTitle(csv(A), 'docs/drafts/alpha.md', 'The "Real" Story');
    if (r.kind !== 'updated') throw new Error(r.kind);
    expect(rows(r.text)[0].title).toBe('The "Real" Story');
    expect(rows(r.text)[0].notes).toBe('');
  });

  it('is a no-op when the title is unchanged, including for a quoted existing cell', () => {
    expect(setCalendarTitle(csv(A, B), 'docs/drafts/alpha.md', 'Alpha post').kind).toBe('unchanged');
    expect(setCalendarTitle(csv(A, B), 'docs/drafts/beta.md', 'Beta, with comma').kind).toBe('unchanged');
  });

  it('reports not-found rather than touching anything', () => {
    expect(setCalendarTitle(csv(A, B), 'docs/drafts/missing.md', 'x').kind).toBe('not-found');
  });

  it('refuses when two rows share a draftPath', () => {
    expect(setCalendarTitle(csv(A, A), 'docs/drafts/alpha.md', 'x')).toEqual({ kind: 'ambiguous', count: 2 });
  });

  it('finds columns by header name, not position', () => {
    const text = 'draftPath,notes,title\ndocs/drafts/a.md,hi,Old\ndocs/drafts/b.md,yo,Other\n';
    const r = setCalendarTitle(text, 'docs/drafts/a.md', 'New');
    expect(r).toEqual({ kind: 'updated', text: 'draftPath,notes,title\ndocs/drafts/a.md,hi,New\ndocs/drafts/b.md,yo,Other\n' });
  });

  it('preserves CRLF line endings and a missing trailing newline', () => {
    const text = `${HEADER}\r\n${A}\r\n${C}`;
    const r = setCalendarTitle(text, 'docs/drafts/gamma.md', 'G2');
    expect(r).toEqual({ kind: 'updated', text: `${HEADER}\r\n${A}\r\nG2,ship,drafted,,docs/drafts/gamma.md,` });
  });

  it('handles a quoted cell containing a newline in another row', () => {
    const multi = '"Line one\nline two",insight,drafted,,docs/drafts/m.md,';
    const r = setCalendarTitle(csv(multi, A), 'docs/drafts/alpha.md', 'A2');
    if (r.kind !== 'updated') throw new Error(r.kind);
    expect(r.text).toBe(csv(multi, 'A2,building,queued,2026-10-10,docs/drafts/alpha.md,'));
  });

  it('reports bad-header when the needed columns are missing', () => {
    expect(setCalendarTitle('a,b\n1,2\n', 'x', 'y').kind).toBe('bad-header');
  });
});

describe('encodeCsvField', () => {
  it('quotes only when needed', () => {
    expect(encodeCsvField('plain')).toBe('plain');
    expect(encodeCsvField('a,b')).toBe('"a,b"');
    expect(encodeCsvField('say "hi"')).toBe('"say ""hi"""');
    expect(encodeCsvField(' padded')).toBe('" padded"');
  });
});

describe('against the real calendar snapshot', () => {
  const p = path.join(process.cwd(), 'data', 'editorial-calendar.csv');
  const real = fs.existsSync(p) ? fs.readFileSync(p, 'utf-8') : null;
  (real ? it : it.skip)('renaming any row and renaming back restores every parsed row (an originally over-quoted cell may legitimately lose its quotes)', () => {
    const all = rows(real as string).filter(r => r.draftPath);
    expect(all.length).toBeGreaterThan(0);
    for (const r of all) {
      const there = setCalendarTitle(real as string, r.draftPath, `${r.title} / "x", y`);
      if (there.kind === 'ambiguous') continue;
      if (there.kind !== 'updated') throw new Error(`${r.draftPath}: ${there.kind}`);
      const back = setCalendarTitle(there.text, r.draftPath, r.title);
      expect(back.kind === 'updated' && rows(back.text)).toEqual(rows(real as string));
    }
  });
});
