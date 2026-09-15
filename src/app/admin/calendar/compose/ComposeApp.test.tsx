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
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComposeApp } from './ComposeApp';

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('slug=test-draft'),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), refresh: jest.fn() }),
}));

const BODY = [
  '# Test Draft',
  '',
  'First paragraph of the body.',
  '',
  'Second paragraph, a little longer, so caret positions past 40 are real.',
].join('\n');

function mockDraftFetch() {
  global.fetch = jest.fn((url: string) => {
    if (typeof url === 'string' && url.startsWith('/api/compose?slug=')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          slug: 'test-draft',
          title: 'Test Draft',
          pubDate: '2026-09-15',
          frontmatter: { image: '', alt: '', caption: '' },
          body: BODY,
          sha: null,
        }),
      });
    }
    return Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve({}) });
  }) as unknown as typeof fetch;
}

/** The body textarea, once the draft's load fetch has resolved. */
async function bodyField(): Promise<HTMLTextAreaElement> {
  return (await screen.findByLabelText('Markdown source')) as HTMLTextAreaElement;
}

beforeEach(() => {
  window.localStorage.clear();
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
