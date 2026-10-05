/**
 * Rewrite one row's title cell in editorial-calendar.csv without reserializing
 * the file. Rows are matched by the draftPath column (looked up by header name,
 * never by position); every byte outside the one title cell is left untouched,
 * so the commit diff is exactly one line and a concurrent edit to any other row
 * can't be clobbered by a reformat.
 */

export type TitleUpdate =
  | { kind: 'updated'; text: string }
  | { kind: 'unchanged' }
  | { kind: 'not-found' }
  | { kind: 'ambiguous'; count: number }
  | { kind: 'bad-header' };

interface Span { start: number; end: number }

/** Split into records of raw field spans, quote-aware (CSV allows newlines in quoted cells). */
function scanRecords(text: string): Span[][] {
  const records: Span[][] = [];
  let fields: Span[] = [];
  let i = 0;
  const n = text.length;

  while (i < n) {
    const start = i;
    if (text[i] === '"') {
      i++;
      while (i < n) {
        if (text[i] === '"') {
          if (text[i + 1] === '"') { i += 2; continue; }
          i++;
          break;
        }
        i++;
      }
    }
    while (i < n && text[i] !== ',' && text[i] !== '\n' && text[i] !== '\r') i++;
    fields.push({ start, end: i });

    if (i >= n) break;
    if (text[i] === ',') { i++; if (i >= n) fields.push({ start: i, end: i }); continue; }
    if (text[i] === '\r' && text[i + 1] === '\n') i += 2; else i++;
    if (!(fields.length === 1 && fields[0].start === fields[0].end)) records.push(fields);
    fields = [];
  }
  if (fields.length > 0 && !(fields.length === 1 && fields[0].start === fields[0].end)) records.push(fields);
  return records;
}

function decode(raw: string): string {
  const v = raw.trim();
  if (v.startsWith('"') && v.endsWith('"') && v.length >= 2) return v.slice(1, -1).replace(/""/g, '"');
  return v;
}

export function encodeCsvField(value: string): string {
  return /[",\r\n]/.test(value) || value !== value.trim()
    ? `"${value.replace(/"/g, '""')}"`
    : value;
}

export function setCalendarTitle(csvText: string, draftPath: string, newTitle: string): TitleUpdate {
  const records = scanRecords(csvText);
  if (records.length === 0) return { kind: 'bad-header' };

  const header = records[0].map(f => decode(csvText.slice(f.start, f.end)));
  const titleCol = header.indexOf('title');
  const pathCol = header.indexOf('draftPath');
  if (titleCol < 0 || pathCol < 0) return { kind: 'bad-header' };

  const matches = records.slice(1).filter(r => {
    const f = r[pathCol];
    return f !== undefined && decode(csvText.slice(f.start, f.end)) === draftPath;
  });
  if (matches.length === 0) return { kind: 'not-found' };
  if (matches.length > 1) return { kind: 'ambiguous', count: matches.length };

  const row = matches[0];
  const cell = row[titleCol];
  if (!cell) return { kind: 'bad-header' };
  if (decode(csvText.slice(cell.start, cell.end)) === newTitle) return { kind: 'unchanged' };

  return {
    kind: 'updated',
    text: csvText.slice(0, cell.start) + encodeCsvField(newTitle) + csvText.slice(cell.end),
  };
}
