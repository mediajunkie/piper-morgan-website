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

/**
 * Local-storage safety net for the compose editor.
 *
 * The GitHub-Contents-API save is optimistic-concurrency guarded (rejects with
 * 409 if the file's sha changed since load — e.g. Comms pushing a direct git
 * commit while PM has the same draft open). Before this, a rejected save meant
 * PM had to manually copy the in-progress edit out, reload, and paste it back
 * in — and the pasted-back copy was based on the STALE pre-reload load, so
 * concurrent fixes (Comms' typos) got silently reverted on reapply (Comms
 * 2026-07-25). This persists every edit to localStorage as it happens, so a
 * failed save — or a crashed tab, or a stray navigation — never risks the
 * in-progress edit: reload always offers it back, with an explicit choice
 * rather than a silent overwrite of whatever just loaded from the server.
 */
function localDraftKey(slug: string) {
  return `compose-draft:${slug}`;
}

interface LocalDraft {
  image: string;
  alt: string;
  caption: string;
  body: string;
  savedAt: string;
}

function readLocalDraft(slug: string): LocalDraft | null {
  try {
    const raw = window.localStorage.getItem(localDraftKey(slug));
    return raw ? (JSON.parse(raw) as LocalDraft) : null;
  } catch {
    return null;
  }
}

function writeLocalDraft(slug: string, d: Omit<LocalDraft, 'savedAt'>) {
  try {
    window.localStorage.setItem(localDraftKey(slug), JSON.stringify({ ...d, savedAt: new Date().toISOString() }));
  } catch {
    // Storage full/unavailable (private browsing, quota) — the safety net is
    // best-effort; the server save path is unaffected either way.
  }
}

function clearLocalDraft(slug: string) {
  try {
    window.localStorage.removeItem(localDraftKey(slug));
  } catch {
    // no-op — see writeLocalDraft
  }
}

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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [localDraftOffer, setLocalDraftOffer] = useState<LocalDraft | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string | null>(null);
  const shaRef = useRef<string | null>(null);
  // Autosave's 30s setTimeout closure is created at the moment a field changes and can
  // outlive several further edits before it fires. If doSave read `image`/`alt`/`caption`/
  // `body` from that closure, it would save whatever those fields were AT ARM TIME, not at
  // fire time — a real incident (2026-07-30): a timer armed by a field's first edit captured
  // that field as empty, a later manual "Save now" click correctly persisted the real value
  // but didn't cancel the pending timer, and 28s later it fired and silently overwrote the
  // correct save with its stale empty snapshot. Reading current values through this ref
  // (kept in sync every render, below) makes ANY leftover timer harmless — whenever it fires,
  // it saves what is actually on screen, never a frozen-in-time snapshot.
  const fieldsRef = useRef({ image: '', alt: '', caption: '', body: '' });

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
        const serverKey = JSON.stringify({ image: d.frontmatter.image, alt: d.frontmatter.alt, caption: d.frontmatter.caption, body: d.body });
        lastSavedRef.current = serverKey;

        // Offer a local draft only if it exists AND differs from what the
        // server just returned — an identical local copy is just noise.
        const local = readLocalDraft(slug);
        if (local) {
          const localKey = JSON.stringify({ image: local.image, alt: local.alt, caption: local.caption, body: local.body });
          if (localKey !== serverKey) setLocalDraftOffer(local);
          else clearLocalDraft(slug); // redundant, safe to drop
        }
      })
      .catch(e => setLoadError(String(e)));
  }, [slug]);

  // getPayload reads the ref, not the closed-over state — see fieldsRef's comment above for why.
  const getPayload = useCallback(() => ({ ...fieldsRef.current }), []);

  // Keep fieldsRef current AND persist every edit locally — one effect, since both need to
  // fire on exactly the same changes. Cheap, synchronous-enough (effects run before any
  // queued setTimeout can fire), and the whole point of both is surviving whatever the
  // server save does or doesn't do.
  useEffect(() => {
    fieldsRef.current = { image, alt, caption, body };
    if (!draft) return; // don't clobber localStorage with pre-load empty state
    writeLocalDraft(slug, { image, alt, caption, body });
  }, [slug, draft, image, alt, caption, body]);

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
        // Deliberately do NOT clear the local draft here — a rejected save
        // (409 conflict or otherwise) is exactly the case this safety net
        // exists for. It stays in localStorage until a save succeeds.
        throw new Error(errBody?.error || `HTTP ${res.status}`);
      }
      lastSavedRef.current = key;
      const { committed, sha: newSha } = await res.json();
      if (newSha) shaRef.current = newSha;
      const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setSaveStatus({ kind: 'saved', time: t, committed: !!committed });
      // Successfully persisted server-side — the local safety copy is no
      // longer the only record of this content, so clear it.
      clearLocalDraft(slug);
    } catch (e) {
      setSaveStatus({ kind: 'error', message: e instanceof Error ? e.message : String(e) });
    }
  }, [slug, getPayload]);

  const scheduleAutosave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSaveStatus(s => s.kind === 'saved' ? { kind: 'unsaved' } : s.kind === 'idle' ? { kind: 'unsaved' } : s);
    timerRef.current = setTimeout(doSave, AUTOSAVE_MS);
  }, [doSave]);

  const applyLocalDraft = useCallback((local: LocalDraft) => {
    setImage(local.image);
    setAlt(local.alt);
    setCaption(local.caption);
    setBody(local.body);
    scanPlaceholders(local.body);
    setLocalDraftOffer(null);
    setSaveStatus({ kind: 'unsaved' });
    scheduleAutosave();
  }, [scheduleAutosave]);

  const discardLocalDraft = useCallback(() => {
    clearLocalDraft(slug);
    setLocalDraftOffer(null);
  }, [slug]);

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

  // Manual "Save now" click — belt-and-suspenders defense alongside the fieldsRef fix above:
  // this used to call doSave directly without cancelling a pending autosave timer, which was
  // half of the 2026-07-30 incident (the other half was the timer's stale closure, fixed
  // above). Clearing the timer here means a manual save also cancels whatever's still armed,
  // matching handleFormBlur's behavior instead of leaving a redundant timer ticking.
  const handleManualSave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    doSave();
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
        <SaveIndicator status={saveStatus} onSave={handleManualSave} />
      </div>

      {localDraftOffer && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded text-sm text-blue-900 dark:text-blue-200" role="alert" aria-live="polite">
          <strong>An unsaved local copy was found</strong> from{' '}
          {new Date(localDraftOffer.savedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })},
          different from what just loaded from GitHub — likely from a save that didn&apos;t go through
          (e.g. someone else edited this file in the meantime).
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => applyLocalDraft(localDraftOffer)}
              className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
            >
              Restore local copy
            </button>
            <button
              onClick={discardLocalDraft}
              className="px-3 py-1.5 rounded-md border border-blue-300 dark:border-blue-700 text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40"
            >
              Discard, keep what loaded
            </button>
          </div>
        </div>
      )}

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
          <div className="flex gap-2">
            <input
              id="field-image"
              type="text"
              value={image}
              onChange={e => handleFieldChange(setImage)(e.target.value)}
              className={`${inputCls} flex-1`}
            />
            <ImageUpload
              slug={slug}
              uploading={uploading}
              onUploadStart={() => setUploading(true)}
              onUploaded={filename => {
                setUploading(false);
                handleFieldChange(setImage)(filename);
              }}
              onError={message => {
                setUploading(false);
                setUploadError(message);
              }}
            />
          </div>
          {uploadError && (
            <p className="mt-1 text-xs text-red-700 dark:text-red-300" role="alert">{uploadError}</p>
          )}
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
  // key={slug} forces a full remount on every slug change (website#35) — without it, React
  // reuses the same ComposeEdit instance across different drafts (same component type, same
  // JSX position), so a slug change lands mid-render with the PREVIOUS draft's still-loaded
  // state (draft/image/alt/caption/body) intact. The local-draft write-effect's guard
  // (`if (!draft) return`) checks whether ANY draft is loaded, not whether it's the draft for
  // the CURRENT slug — so it can persist the previous draft's content under the new slug's
  // localStorage key before the new slug's own fetch resolves, which the load-effect's
  // local-vs-server diff then offers back as an "unsaved local copy" for the wrong draft.
  return slug ? <ComposeEdit key={slug} slug={slug} /> : <ComposeList />;
}

// ─── Shared sub-components ────────────────────────────────────────────────────

const inputCls = [
  'w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700',
  'bg-white dark:bg-dark-surface text-text-dark dark:text-dark-text',
  'focus:outline-none focus:ring-2 focus:ring-primary-teal/50 focus:border-primary-teal',
  'text-sm',
].join(' ');

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // data:<mime>;base64,<payload> — strip the prefix, keep the payload
      resolve(result.slice(result.indexOf(',') + 1));
    };
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

function ImageUpload({
  slug, uploading, onUploadStart, onUploaded, onError,
}: {
  slug: string;
  uploading: boolean;
  onUploadStart: () => void;
  onUploaded: (filename: string) => void;
  onError: (message: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;
    onUploadStart();
    try {
      const contentBase64 = await fileToBase64(file);
      const res = await fetch(`/api/compose/upload?slug=${encodeURIComponent(slug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentBase64 }),
      });
      const data = await res.json().catch(() => null) as { filename?: string; error?: string } | null;
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      if (!data?.filename) throw new Error('Upload succeeded but no filename returned');
      onUploaded(data.filename);
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        onChange={handleChange}
        className="hidden"
        aria-label="Upload image"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-sm text-text-dark dark:text-dark-text hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {uploading ? 'Uploading…' : 'Upload…'}
      </button>
    </>
  );
}

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
