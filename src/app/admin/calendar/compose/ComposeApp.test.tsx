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
import { ComposeApp } from './ComposeApp';

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
