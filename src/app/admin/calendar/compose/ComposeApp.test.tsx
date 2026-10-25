/**
 * Regression net for the compose editor's body field.
 *
 * WHY THIS FILE EXISTS (website#42): bb579b5 shipped the Source/Split/Preview
 * toggle with a caret-restore `useLayoutEffect` whose deps included `body`. It
 * therefore re-ran on every keystroke and rewound the caret to its pre-keystroke
 * position, so typed characters came out reversed — "odd" became "ddo". It
 * reached production and corrupted saved draft content before PM caught it.
 *
 * The toggle itself HAD been browser-verified. What was never tested was the
 * ordinary typing path the toggle shares caret state with. So this file asserts
 * both, together: a change that fixes one by breaking the other fails here.
 */
// Type-only need: jest.setup.cjs already registers the matchers at runtime, but a
// .cjs require brings no type augmentation, so `toBeInTheDocument` is untyped
// without this import.
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComposeApp, classifyLocalDraft, diffLines } from './ComposeApp';

// Mutable so a test can navigate between drafts — website#35's mechanism is a
// slug CHANGE, which a static mock cannot express.
let currentSlug = 'test-draft';

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(`slug=${currentSlug}`),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), refresh: jest.fn() }),
}));

const BODY = [
  '# Test Draft',
  '',
  'First paragraph of the body.',
  '',
  'Second paragraph, a little longer, so caret positions past 40 are real.',
].join('\n');

/** Per-slug server content, so a slug switch is distinguishable. */
const SERVER_BODIES: Record<string, string> = {
  'test-draft': BODY,
  'other-draft': '# Other Draft\n\nCompletely different server content.',
};

function mockDraftFetch() {
  global.fetch = jest.fn((url: string) => {
    if (typeof url === 'string' && url.startsWith('/api/compose?slug=')) {
      const slug = decodeURIComponent(url.split('slug=')[1]);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          slug,
          title: slug,
          pubDate: '2026-09-15',
          frontmatter: { image: '', alt: '', caption: '' },
          body: SERVER_BODIES[slug] ?? BODY,
          sha: null,
        }),
      });
    }
    return Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve({}) });
  }) as unknown as typeof fetch;
}

/** Seed a local draft exactly as the editor's own writer would. */
function seedLocalDraft(slug: string, body: string) {
  window.localStorage.setItem(`compose-draft:${slug}`, JSON.stringify({
    image: '', alt: '', caption: '', body, savedAt: new Date().toISOString(),
  }));
}

/** The body textarea, once the draft's load fetch has resolved. */
async function bodyField(): Promise<HTMLTextAreaElement> {
  return (await screen.findByLabelText('Markdown source')) as HTMLTextAreaElement;
}

beforeEach(() => {
  window.localStorage.clear();
  currentSlug = 'test-draft';
  mockDraftFetch();
});

describe('compose body — typing', () => {
  it('inserts typed characters in order at the start of the body', async () => {
    const user = userEvent.setup();
    render(<ComposeApp />);
    const el = await bodyField();
    await waitFor(() => expect(el.value).toContain('First paragraph'));

    await user.type(el, 'odd', { initialSelectionStart: 0, initialSelectionEnd: 0 });

    // The regression produced 'ddo' here.
    expect(el.value.slice(0, 3)).toBe('odd');
    expect(el.selectionStart).toBe(3);
  });

  it('inserts typed characters in order mid-document and advances the caret', async () => {
    const user = userEvent.setup();
    render(<ComposeApp />);
    const el = await bodyField();
    await waitFor(() => expect(el.value).toContain('First paragraph'));

    await user.type(el, 'hello', { initialSelectionStart: 20, initialSelectionEnd: 20 });

    // The regression produced 'olleh' here, with the caret pinned at 20.
    expect(el.value.slice(20, 25)).toBe('hello');
    expect(el.selectionStart).toBe(25);
  });
});

describe('compose body — view toggle (the bb579b5 feature)', () => {
  it('preserves the caret across a Source → Preview → Source round-trip', async () => {
    const user = userEvent.setup();
    render(<ComposeApp />);
    const el = await bodyField();
    await waitFor(() => expect(el.value).toContain('First paragraph'));

    el.focus();
    el.setSelectionRange(18, 27);

    await user.click(screen.getByRole('button', { name: 'Preview' }));
    // The textarea genuinely unmounts in preview — that is why the caret has to
    // be captured continuously rather than read at toggle time.
    expect(screen.queryByLabelText('Markdown source')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Source' }));
    const back = await bodyField();
    expect([back.selectionStart, back.selectionEnd]).toEqual([18, 27]);
  });

  it('still types correctly after a toggle round-trip', async () => {
    const user = userEvent.setup();
    render(<ComposeApp />);
    const el = await bodyField();
    await waitFor(() => expect(el.value).toContain('First paragraph'));

    await user.click(screen.getByRole('button', { name: 'Preview' }));
    await user.click(screen.getByRole('button', { name: 'Source' }));

    const back = await bodyField();
    await user.type(back, 'xyz', { initialSelectionStart: 0, initialSelectionEnd: 0 });

    expect(back.value.slice(0, 3)).toBe('xyz');
  });
});

/**
 * website#35 — "Restore local copy" rendered BLANK instead of the saved draft.
 *
 * The issue lists three unknowns. These cover them:
 *   (a) was the local copy empty, or did restore fail to populate the editor?
 *   (b) do the dialog's diff logic and the restore action read the same source?
 *   (c) is it reproducible / a tab-or-navigation race?
 *
 * (b) is answered by construction — the button calls applyLocalDraft(localDraftOffer),
 * i.e. the very object the dialog was offered from. So a blank restore requires a
 * blank local draft to have been WRITTEN. That is the mechanism `8edfc11` fixed:
 * without key={slug}, React reused one ComposeEdit across different drafts, and the
 * local-draft write-effect (guarded only on "is ANY draft loaded") could persist the
 * previous draft's state under the new slug's key before the new fetch resolved.
 */
describe('compose local-draft restore (website#35)', () => {
  it('offers the local copy when it differs from the server, and restores its CONTENT — not blank', async () => {
    const user = userEvent.setup();
    seedLocalDraft('test-draft', '# Local edit\n\nThis text only exists in localStorage.');
    render(<ComposeApp />);

    await user.click(await screen.findByRole('button', { name: /restore local copy/i }));

    const el = await bodyField();
    // The defect was a BLANK editor here.
    expect(el.value).toContain('This text only exists in localStorage');
    expect(el.value.trim()).not.toBe('');
  });

  it('does not offer a local copy that matches the server (no spurious dialog)', async () => {
    seedLocalDraft('test-draft', BODY);
    render(<ComposeApp />);
    await bodyField();

    await waitFor(() => expect(screen.queryByRole('button', { name: /restore local copy/i })).not.toBeInTheDocument());
  });

  it('does not leak one draft\'s content into another draft\'s local copy across a slug change', async () => {
    // The root mechanism, and the window is narrow enough that getting it wrong
    // yields a test that passes either way. The write-effect's deps include
    // `slug`, so a slug change re-runs it IMMEDIATELY — while `draft` and `body`
    // still hold the PREVIOUS draft, because the new slug's fetch has not
    // resolved. Without key={slug} there is no remount, so that stale state is
    // written under the new slug's key.
    //
    // Therefore the new slug's fetch MUST be pending at the moment we assert.
    // An immediately-resolving mock overwrites the evidence and the test passes
    // against broken code — verified: it did, before this was fixed.
    let releaseOther: () => void = () => {};
    const otherPending = new Promise<void>(res => { releaseOther = res; });
    const realFetch = global.fetch;
    global.fetch = jest.fn((url: string) => {
      if (typeof url === 'string' && url.includes('slug=other-draft')) {
        return otherPending.then(() => (realFetch as jest.Mock)(url));
      }
      return (realFetch as jest.Mock)(url);
    }) as unknown as typeof fetch;

    const { rerender } = render(<ComposeApp />);
    const el = await bodyField();
    await waitFor(() => expect(el.value).toContain('First paragraph'));

    currentSlug = 'other-draft';
    rerender(<ComposeApp />);

    // Assert while other-draft's fetch is still in flight — this is the window.
    await waitFor(() => {
      expect(window.localStorage.getItem('compose-draft:test-draft')).not.toBeNull();
    });
    const leaked = window.localStorage.getItem('compose-draft:other-draft');
    expect(
      leaked === null || !JSON.parse(leaked).body.includes('First paragraph of the body.'),
    ).toBe(true);

    releaseOther();
    global.fetch = realFetch;
  });
});

/**
 * website#51 — the restore banner must tell "your unsaved edits" from "someone else edited
 * the file since your last save", and show a diff before either choice. On 2026-10-24 a bare
 * Restore reverted five approved fixes because the local copy was just an older saved text.
 */
function seedBasedDraft(slug: string, body: string, base: { baseKey?: string; baseSha?: string | null }) {
  window.localStorage.setItem(`compose-draft:${slug}`, JSON.stringify({
    image: '', alt: '', caption: '', body, savedAt: new Date().toISOString(), ...base,
  }));
}
const keyOf = (body: string) => JSON.stringify({ image: '', alt: '', caption: '', body });

describe('compose restore banner (website#51)', () => {
  it('edited remotely: local copy equals its own base, so no Restore is offered and the user is told', async () => {
    const OLD = '# Test Draft\n\nAn older text that the server has since replaced.';
    seedBasedDraft('test-draft', OLD, { baseKey: keyOf(OLD), baseSha: 'old-sha' });
    render(<ComposeApp />);
    await bodyField();

    expect(await screen.findByText(/updated remotely since your last save/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /restore local copy/i })).not.toBeInTheDocument();
    expect(window.localStorage.getItem('compose-draft:test-draft')).not.toContain('older text');
  });

  it('unsaved edits: says so and shows the two sides before the buttons', async () => {
    const BASE = BODY;
    const MINE = BODY + '\n\nA sentence I typed and never saved.';
    seedBasedDraft('test-draft', MINE, { baseKey: keyOf(BASE), baseSha: null });
    render(<ComposeApp />);

    expect(await screen.findByText(/You have unsaved edits/i)).toBeInTheDocument();
    const diff = screen.getByTestId('local-draft-diff');
    expect(diff).toHaveTextContent('A sentence I typed and never saved.');
    expect(screen.getByRole('button', { name: /restore local copy/i })).toBeInTheDocument();
  });

  it('conflict: unsaved edits on an older base, and the file moved on', async () => {
    const BASE = '# Test Draft\n\nBase text at the time I started.';
    const MINE = BASE + ' Plus my edit.';
    seedBasedDraft('test-draft', MINE, { baseKey: keyOf(BASE), baseSha: 'old-sha' });
    render(<ComposeApp />);

    expect(await screen.findByText(/Conflict: you have unsaved edits/i)).toBeInTheDocument();
    expect(screen.getByTestId('local-draft-diff')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /restore local copy/i })).toBeInTheDocument();
  });

  it('older copy with no recorded base: warns that Restore could revert someone else and shows the diff', async () => {
    seedLocalDraft('test-draft', '# Local edit\n\nNo base recorded for this one.');
    render(<ComposeApp />);

    expect(await screen.findByText(/no record of the version it started from/i)).toBeInTheDocument();
    expect(screen.getByTestId('local-draft-diff')).toHaveTextContent('No base recorded for this one.');
  });
});

describe('classifyLocalDraft and diffLines (website#51)', () => {
  const f = { image: '', alt: '', caption: '' };
  it('classifies the four cases', () => {
    expect(classifyLocalDraft({ ...f, body: 'x' }, 's')).toBe('unknown');
    expect(classifyLocalDraft({ ...f, body: 'x', baseKey: keyOf('x'), baseSha: 'a' }, 'b')).toBe('remote');
    expect(classifyLocalDraft({ ...f, body: 'y', baseKey: keyOf('x'), baseSha: 'a' }, 'a')).toBe('edits');
    expect(classifyLocalDraft({ ...f, body: 'y', baseKey: keyOf('x'), baseSha: 'a' }, 'b')).toBe('conflict');
  });
  it('diffLines marks only the lines that differ', () => {
    const rows = diffLines('a\nb\nc', 'a\nB\nc');
    expect(rows.filter(r => r.kind === 'changed')).toEqual([
      { kind: 'changed', theirs: 'b', mine: null },
      { kind: 'changed', theirs: null, mine: 'B' },
    ]);
  });
});

/**
 * Comms, 2026-10-25: "Draft changed on GitHub since it was loaded" against the editor's
 * own save. A save can commit while its response never arrives; the browser then holds
 * the old sha and every later save is refused. These cover the browser half (the server
 * half returns the current sha when GitHub already holds exactly the content sent).
 */
describe('compose save: stale sha after a save whose response was lost', () => {
  const draftDetail = (body: string, sha: string) => ({
    ok: true,
    json: () => Promise.resolve({
      slug: 'test-draft', title: 't', pubDate: '2026-09-15',
      frontmatter: { image: '', alt: '', caption: '' }, body, sha,
    }),
  });

  it('adopts the current sha when GitHub holds the lost save, then saves the newer edit', async () => {
    const user = userEvent.setup();
    const posts: Array<{ sha: string; body: string }> = [];
    let remoteBody = BODY;
    let remoteSha = 'A';
    global.fetch = jest.fn((url: string, init?: RequestInit) => {
      if (init?.method === 'POST') {
        const sent = JSON.parse(String(init.body));
        posts.push({ sha: sent.sha, body: sent.body });
        if (posts.length === 1) {
          // Commits on GitHub, but the browser never hears back.
          remoteBody = sent.body; remoteSha = 'B';
          return Promise.reject(new TypeError('Failed to fetch'));
        }
        if (sent.sha !== remoteSha) {
          return Promise.resolve({ ok: false, status: 409, json: () => Promise.resolve({ error: 'Draft changed on GitHub since it was loaded' }) });
        }
        remoteBody = sent.body; remoteSha = 'C';
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ saved: true, committed: true, sha: 'C' }) });
      }
      return Promise.resolve(draftDetail(remoteBody, remoteSha));
    }) as unknown as typeof fetch;

    render(<ComposeApp />);
    const el = await bodyField();
    await waitFor(() => expect(el.value).toContain('First paragraph'));

    await user.type(el, 'one', { initialSelectionStart: 0, initialSelectionEnd: 0 });
    await user.click(await screen.findByRole('button', { name: /save now/i }));
    await screen.findByText(/Save failed/);

    await user.type(el, 'two', { initialSelectionStart: 0, initialSelectionEnd: 0 });
    await user.click(await screen.findByRole('button', { name: /save now/i }));
    await screen.findByText(/Saved/);

    expect(posts).toHaveLength(3);
    expect(posts[1].sha).toBe('A');   // stale: refused
    expect(posts[2].sha).toBe('B');   // adopted from GitHub, then accepted
    expect(posts[2].body.startsWith('two')).toBe(true);
  });

  it('does not take over a sha when GitHub holds someone else\'s content', async () => {
    const user = userEvent.setup();
    let posts = 0;
    global.fetch = jest.fn((url: string, init?: RequestInit) => {
      if (init?.method === 'POST') {
        posts += 1;
        return Promise.resolve({ ok: false, status: 409, json: () => Promise.resolve({ error: 'Draft changed on GitHub since it was loaded. Last change on GitHub: Someone, now.' }) });
      }
      return Promise.resolve(draftDetail('# Edited elsewhere', 'Z'));
    }) as unknown as typeof fetch;

    render(<ComposeApp />);
    const el = await bodyField();
    await waitFor(() => expect(el.value).toContain('Edited elsewhere'));
    await user.type(el, 'mine', { initialSelectionStart: 0, initialSelectionEnd: 0 });
    await user.click(await screen.findByRole('button', { name: /save now/i }));

    await screen.findByText(/Last change on GitHub: Someone/);
    expect(posts).toBe(1);
  });
});
