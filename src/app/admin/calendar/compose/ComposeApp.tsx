'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface DraftSummary {
  slug: string;
  title: string;
  status: string;
  pubDate: string;
  draftPath: string;
}

interface DraftDetail {
  slug: string;
  title: string;
  pubDate: string;
  frontmatter: { image: string; alt: string; caption: string };
  body: string;
  /** GitHub file SHA (GitHub storage mode) — null in local filesystem mode. */
  sha: string | null;
}

type SaveStatus =
  | { kind: 'idle' }
  | { kind: 'unsaved' }
  | { kind: 'saving' }
  | { kind: 'saved'; time: string; committed: boolean }
  | { kind: 'error'; message: string };

// ─── List view ───────────────────────────────────────────────────────────────

function ComposeList() {
  const router = useRouter();
  const [drafts, setDrafts] = useState<DraftSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/compose')
      .then(r => r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`))
      .then(d => setDrafts(d.drafts))
      .catch(e => setError(String(e)));
  }, []);

  if (error) return (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
      Failed to load drafts: {error}
      <p className="mt-1 text-xs">Is the dev server running? (<code>npm run dev</code>)</p>
    </div>
  );
  if (!drafts) return <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading drafts…</p>;
  if (drafts.length === 0) return <p className="text-sm text-gray-500 dark:text-gray-400 italic">No in-flight drafts found.</p>;

  return (
    <ul className="space-y-2">
      {drafts.map(d => (
        <li key={d.slug}>
          <button
            onClick={() => router.push(`/admin/calendar/compose?slug=${encodeURIComponent(d.slug)}`)}
            className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-surface hover:border-primary-teal hover:bg-primary-teal/5 dark:hover:bg-primary-teal/10 transition-colors group"
          >
            <span className="block text-sm font-semibold text-text-dark dark:text-dark-text group-hover:text-primary-teal-text dark:group-hover:text-primary-teal">
              {d.title || '(untitled)'}
            </span>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              <StatusChip status={d.status} />
              {d.pubDate && <> · {d.pubDate}</>}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

// ─── Markdown preview ─────────────────────────────────────────────────────────

function mdToHtml(md: string): string {
  // Minimal markdown → HTML for admin preview. Not exhaustive — covers typical post content.
  let html = md
    // Fenced code blocks (before inline code)
    .replace(/```[^\n]*\n([\s\S]*?)```/g, (_m, code) => `<pre><code>${escHtml(code.trim())}</code></pre>`)
    // Headings
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Horizontal rule
    .replace(/^---+$/gm, '<hr>')
    // Unordered list items
    .replace(/^[*-] (.+)$/gm, '<li>$1</li>')
    // Inline formatting
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');

  // Wrap consecutive <li> blocks in <ul>
  html = html.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, m => `<ul>${m}</ul>`);

  // Wrap bare text blocks (not already wrapped in a block tag) in <p>
  html = html.split('\n\n').map(block => {
    const t = block.trim();
    if (!t) return '';
    if (/^<(h[1-6]|ul|ol|pre|hr|blockquote)/.test(t)) return t;
    return `<p>${t.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');

  return html;
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ─── Edit view ────────────────────────────────────────────────────────────────

const AUTOSAVE_MS = 30_000;
const PLACEHOLDER_RE = /\[[^\]]{1,120}\]/g;

function ComposeEdit({ slug }: { slug: string }) {
  const router = useRouter();
  const [draft, setDraft] = useState<DraftDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Form field state
  const [image, setImage] = useState('');
  const [alt, setAlt] = useState('');
  const [caption, setCaption] = useState('');
  const [body, setBody] = useState('');

  const [saveStatus, setSaveStatus] = useState<SaveStatus>({ kind: 'idle' });
  const [placeholders, setPlaceholders] = useState<string[]>([]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string | null>(null);
  const shaRef = useRef<string | null>(null);

  // Load draft on mount
  useEffect(() => {
    fetch(`/api/compose?slug=${encodeURIComponent(slug)}`)
      .then(r => r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`))
      .then((d: DraftDetail) => {
        setDraft(d);
        setImage(d.frontmatter.image);
        setAlt(d.frontmatter.alt);
        setCaption(d.frontmatter.caption);
        setBody(d.body);
        scanPlaceholders(d.body);
        shaRef.current = d.sha ?? null;
        lastSavedRef.current = JSON.stringify({ image: d.frontmatter.image, alt: d.frontmatter.alt, caption: d.frontmatter.caption, body: d.body });
      })
      .catch(e => setLoadError(String(e)));
  }, [slug]);

  const getPayload = useCallback(() => ({ image, alt, caption, body }), [image, alt, caption, body]);

  const doSave = useCallback(async () => {
    const payload = getPayload();
    const key = JSON.stringify(payload);
    if (lastSavedRef.current === key) return;
    setSaveStatus({ kind: 'saving' });
    try {
      const res = await fetch(`/api/compose?slug=${encodeURIComponent(slug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, sha: shaRef.current }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => null) as { error?: string } | null;
        throw new Error(errBody?.error || `HTTP ${res.status}`);
      }
      lastSavedRef.current = key;
      const { committed, sha: newSha } = await res.json();
      if (newSha) shaRef.current = newSha;
      const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setSaveStatus({ kind: 'saved', time: t, committed: !!committed });
    } catch (e) {
      setSaveStatus({ kind: 'error', message: e instanceof Error ? e.message : String(e) });
    }
  }, [slug, getPayload]);

  const scheduleAutosave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSaveStatus(s => s.kind === 'saved' ? { kind: 'unsaved' } : s.kind === 'idle' ? { kind: 'unsaved' } : s);
    timerRef.current = setTimeout(doSave, AUTOSAVE_MS);
  }, [doSave]);

  function scanPlaceholders(text: string) {
    setPlaceholders(Array.from(text.matchAll(PLACEHOLDER_RE), m => m[0]));
  }

  const handleBodyChange = (val: string) => {
    setBody(val);
    scanPlaceholders(val);
    setSaveStatus({ kind: 'unsaved' });
    scheduleAutosave();
  };

  const handleFieldChange = (setter: (v: string) => void) => (val: string) => {
    setter(val);
    setSaveStatus({ kind: 'unsaved' });
    scheduleAutosave();
  };

  // Save on focus leaving the form area
  const handleFormBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      if (timerRef.current) clearTimeout(timerRef.current);
      doSave();
    }
  }, [doSave]);

  // Cleanup timer on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  if (loadError) return (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
      {loadError}
    </div>
  );
  if (!draft) return <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading draft…</p>;

  return (
    <div onBlur={handleFormBlur}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1">
            <button onClick={() => router.push('/admin/calendar/compose')} className="hover:text-primary-teal-text dark:hover:text-primary-teal">
              ← All drafts
            </button>
          </p>
          <h2 className="text-xl font-bold text-text-dark dark:text-dark-text">{draft.title || slug}</h2>
          {draft.pubDate && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Scheduled {draft.pubDate}</p>}
        </div>
        <SaveIndicator status={saveStatus} onSave={doSave} />
      </div>

      {placeholders.length > 0 && (
        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded text-sm text-amber-800 dark:text-amber-300" role="alert" aria-live="polite">
          <strong>⚠ Placeholder blocks remaining:</strong>
          <ul className="mt-1 ml-4 list-disc space-y-0.5 text-xs font-mono">
            {placeholders.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        <Field label="Image filename" htmlFor="field-image">
          <input
            id="field-image"
            type="text"
            value={image}
            onChange={e => handleFieldChange(setImage)(e.target.value)}
            className={inputCls}
          />
        </Field>

        <Field label="Alt text" htmlFor="field-alt">
          <input
            id="field-alt"
            type="text"
            value={alt}
            onChange={e => handleFieldChange(setAlt)(e.target.value)}
            className={inputCls}
          />
        </Field>

        <Field label="Caption (spoken-line text — double quotes added automatically)" htmlFor="field-caption">
          <input
            id="field-caption"
            type="text"
            value={caption}
            onChange={e => handleFieldChange(setCaption)(e.target.value)}
            className={inputCls}
          />
        </Field>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Body</label>
          <div className="flex flex-col xl:flex-row gap-4">
            <textarea
              id="field-body"
              value={body}
              onChange={e => handleBodyChange(e.target.value)}
              rows={40}
              className={`${inputCls} font-mono text-sm resize-y xl:w-1/2`}
              aria-label="Markdown source"
            />
            <div
              className="xl:w-1/2 min-h-[10rem] border border-gray-200 dark:border-gray-700 rounded-md p-4 overflow-auto bg-gray-50 dark:bg-gray-900 prose prose-sm dark:prose-invert max-w-none"
              aria-label="Preview"
              dangerouslySetInnerHTML={{ __html: mdToHtml(body) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export function ComposeApp() {
  const params = useSearchParams();
  const slug = params?.get('slug') ?? null;
  return slug ? <ComposeEdit slug={slug} /> : <ComposeList />;
}

// ─── Shared sub-components ────────────────────────────────────────────────────

const inputCls = [
  'w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700',
  'bg-white dark:bg-dark-surface text-text-dark dark:text-dark-text',
  'focus:outline-none focus:ring-2 focus:ring-primary-teal/50 focus:border-primary-teal',
  'text-sm',
].join(' ');

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function SaveIndicator({ status, onSave }: { status: SaveStatus; onSave: () => void }) {
  const base = 'text-xs px-3 py-1.5 rounded-md font-medium';
  if (status.kind === 'idle') return null;
  if (status.kind === 'unsaved') return (
    <button onClick={onSave} className={`${base} bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 hover:bg-amber-200`}>
      Unsaved — save now
    </button>
  );
  if (status.kind === 'saving') return <span className={`${base} bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400`}>Saving…</span>;
  if (status.kind === 'saved') return (
    <span className={`${base} bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300`}>
      {status.committed ? `Saved + committed ${status.time}` : `Saved ${status.time}`}
    </span>
  );
  return <span className={`${base} bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300`}>Save failed: {status.message}</span>;
}

function StatusChip({ status }: { status: string }) {
  const s = (status || '').toLowerCase();
  const color =
    s === 'queued'  ? 'text-blue-700 dark:text-blue-300' :
    s === 'ready'   ? 'text-green-700 dark:text-green-300' :
    s === 'drafted' ? 'text-amber-700 dark:text-amber-300' :
                      'text-gray-600 dark:text-gray-400';
  return <span className={color}>{status || 'unset'}</span>;
}
