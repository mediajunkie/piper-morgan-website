/**
 * Title rename on the compose screen (website#44): edits the calendar-row title only,
 * posts to `?action=title`, never touches the draft save path.
 */
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComposeApp } from './ComposeApp';

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('slug=test-draft'),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), refresh: jest.fn() }),
}));

type Call = { url: string; init?: RequestInit };
let calls: Call[];
let titleResponse: { ok: boolean; status?: number; body: unknown };

beforeEach(() => {
  window.localStorage.clear();
  calls = [];
  titleResponse = { ok: true, body: { saved: true, changed: true } };
  global.fetch = jest.fn((url: string, init?: RequestInit) => {
    calls.push({ url, init });
    if (init?.method === 'POST') {
      return Promise.resolve({
        ok: titleResponse.ok,
        status: titleResponse.status ?? 200,
        json: () => Promise.resolve(titleResponse.body),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        slug: 'test-draft', title: 'Original Title', pubDate: '2026-10-10',
        frontmatter: { image: '', alt: '', caption: '' }, body: 'Body text.', sha: null,
      }),
    });
  }) as unknown as typeof fetch;
});

const titlePosts = () => calls.filter(c => c.init?.method === 'POST');

describe('compose title editor', () => {
  it('renames the title, posts only {title} to the title action, and shows the new title', async () => {
    const user = userEvent.setup();
    render(<ComposeApp />);
    await user.click(await screen.findByRole('button', { name: 'Edit title' }));
    const input = screen.getByLabelText('Post title');
    await user.clear(input);
    await user.type(input, 'A "Better", Title');
    await user.click(screen.getByRole('button', { name: 'Save title' }));

    await waitFor(() => expect(screen.getByRole('heading', { name: 'A "Better", Title' })).toBeInTheDocument());
    const posts = titlePosts();
    expect(posts).toHaveLength(1);
    expect(posts[0].url).toBe('/api/compose?slug=test-draft&action=title');
    expect(JSON.parse(posts[0].init!.body as string)).toEqual({ title: 'A "Better", Title' });
  });

  it('writes nothing when the title is unchanged', async () => {
    const user = userEvent.setup();
    render(<ComposeApp />);
    await user.click(await screen.findByRole('button', { name: 'Edit title' }));
    await user.click(screen.getByRole('button', { name: 'Save title' }));
    expect(titlePosts()).toHaveLength(0);
    expect(screen.getByRole('heading', { name: 'Original Title' })).toBeInTheDocument();
  });

  it('shows the server error on a conflict and keeps the old title', async () => {
    titleResponse = { ok: false, status: 409, body: { error: 'Draft changed on GitHub since it was loaded. Reload before saving.' } };
    const user = userEvent.setup();
    render(<ComposeApp />);
    await user.click(await screen.findByRole('button', { name: 'Edit title' }));
    const input = screen.getByLabelText('Post title');
    await user.clear(input);
    await user.type(input, 'New');
    await user.click(screen.getByRole('button', { name: 'Save title' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Reload before saving');
    expect(screen.getByLabelText('Post title')).toHaveValue('New');
  });

  it('cancel discards the edit without posting', async () => {
    const user = userEvent.setup();
    render(<ComposeApp />);
    await user.click(await screen.findByRole('button', { name: 'Edit title' }));
    await user.type(screen.getByLabelText('Post title'), ' extra');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(titlePosts()).toHaveLength(0);
    expect(screen.getByRole('heading', { name: 'Original Title' })).toBeInTheDocument();
  });
});
