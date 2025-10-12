/**
 * CSV Parser for Blog Metadata
 *
 * Reads and parses /data/blog-metadata.csv
 * Provides type-safe access to blog metadata
 */

export interface BlogMetadata {
  slug: string;
  hashId: string;
  title: string;
  imageSlug: string;
  workDate: string;
  pubDate: string;
  category: string;
  cluster: string;
  featured: string;
  notes: string;
}

/**
 * Parse a CSV row, handling quoted fields
 */
function parseCsvRow(row: string): string[] {
  const fields: string[] = [];
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
export function parseBlogMetadataCsv(csvContent: string): BlogMetadata[] {
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
 * Get metadata by slug
 */
export function getMetadataBySlug(
  metadata: BlogMetadata[],
  slug: string
): BlogMetadata | null {
  return metadata.find((m) => m.slug === slug) || null;
}

/**
 * Get metadata by hash ID
 */
export function getMetadataByHashId(
  metadata: BlogMetadata[],
  hashId: string
): BlogMetadata | null {
  return metadata.find((m) => m.hashId === hashId) || null;
}

/**
 * Get all featured posts
 */
export function getFeaturedPosts(metadata: BlogMetadata[]): BlogMetadata[] {
  return metadata.filter((m) => m.featured.toLowerCase() === 'yes');
}

/**
 * Get posts by cluster
 */
export function getPostsByCluster(
  metadata: BlogMetadata[],
  cluster: string
): BlogMetadata[] {
  return metadata.filter(
    (m) => m.cluster.toLowerCase() === cluster.toLowerCase()
  );
}

/**
 * Get posts by category
 */
export function getPostsByCategory(
  metadata: BlogMetadata[],
  category: string
): BlogMetadata[] {
  return metadata.filter(
    (m) => m.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get all unique clusters
 */
export function getAllClusters(metadata: BlogMetadata[]): string[] {
  const clusters = new Set<string>();
  metadata.forEach((m) => {
    if (m.cluster.trim()) {
      clusters.add(m.cluster.trim());
    }
  });
  return Array.from(clusters).sort();
}

/**
 * Get all unique categories
 */
export function getAllCategories(metadata: BlogMetadata[]): string[] {
  const categories = new Set<string>();
  metadata.forEach((m) => {
    if (m.category.trim()) {
      categories.add(m.category.trim());
    }
  });
  return Array.from(categories).sort();
}

/**
 * Sort posts by work date (most recent first)
 */
export function sortByWorkDate(metadata: BlogMetadata[]): BlogMetadata[] {
  return [...metadata].sort((a, b) => {
    if (!a.workDate) return 1;
    if (!b.workDate) return -1;
    return new Date(b.workDate).getTime() - new Date(a.workDate).getTime();
  });
}

/**
 * Sort posts by pub date (most recent first)
 */
export function sortByPubDate(metadata: BlogMetadata[]): BlogMetadata[] {
  return [...metadata].sort((a, b) => {
    if (!a.pubDate) return 1;
    if (!b.pubDate) return -1;
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });
}
