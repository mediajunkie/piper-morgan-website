/**
 * CSV Parser for Blog Metadata (JavaScript)
 *
 * Reads and parses /data/blog-metadata.csv
 * Used by fetch-blog-posts.js to merge CSV metadata with RSS content
 */

import fs from 'fs';
import path from 'path';

/**
 * Parse a CSV row, handling quoted fields
 */
function parseCsvRow(row) {
  const fields = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    const nextChar = row[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // End of field
      fields.push(currentField);
      currentField = '';
    } else {
      currentField += char;
    }
  }

  // Add last field
  fields.push(currentField);

  return fields;
}

/**
 * Parse CSV content into array of metadata objects
 */
export function parseBlogMetadataCsv(csvContent) {
  const lines = csvContent.trim().split('\n');

  if (lines.length === 0) {
    throw new Error('CSV is empty');
  }

  // Skip header row
  const dataLines = lines.slice(1);

  return dataLines.map((line, index) => {
    const fields = parseCsvRow(line);

    if (fields.length !== 10) {
      throw new Error(
        `Invalid CSV row ${index + 2}: expected 10 fields, got ${fields.length}`
      );
    }

    return {
      slug: fields[0].trim(),
      hashId: fields[1].trim(),
      title: fields[2].trim(),
      imageSlug: fields[3].trim(),
      workDate: fields[4].trim(),
      pubDate: fields[5].trim(),
      category: fields[6].trim(),
      cluster: fields[7].trim(),
      featured: fields[8].trim(),
      notes: fields[9].trim(),
    };
  });
}

/**
 * Load blog metadata from CSV file
 */
export function loadBlogMetadata(csvPath) {
  if (!fs.existsSync(csvPath)) {
    console.warn(`⚠️  CSV file not found: ${csvPath}`);
    return [];
  }

  try {
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    return parseBlogMetadataCsv(csvContent);
  } catch (error) {
    console.error(`❌ Error loading CSV: ${error.message}`);
    return [];
  }
}

/**
 * Get metadata by hash ID
 */
export function getMetadataByHashId(metadata, hashId) {
  return metadata.find((m) => m.hashId === hashId) || null;
}

/**
 * Get metadata by slug
 */
export function getMetadataBySlug(metadata, slug) {
  return metadata.find((m) => m.slug === slug) || null;
}
