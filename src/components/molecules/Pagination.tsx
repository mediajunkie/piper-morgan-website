import Link from 'next/link';

export interface PaginationProps {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Base URL for pagination links */
  baseUrl?: string;
  /** Additional CSS classes */
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl = '/blog',
  className = '',
}: PaginationProps) {
  // Don't show pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  const getPageUrl = (page: number) => {
    if (page === 1) {
      return baseUrl;
    }
    return `${baseUrl}/page/${page}`;
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 7; // Show up to 7 page numbers

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={`flex items-center justify-center gap-2 ${className}`}
    >
      {/* Previous Button */}
      {hasPrevious ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="px-4 py-2 text-sm font-medium text-text-dark dark:text-dark-text hover:text-primary-teal-text dark:hover:text-primary-teal hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Go to previous page"
        >
          ← Previous
        </Link>
      ) : (
        <span
          className="px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-600 cursor-not-allowed"
          aria-disabled="true"
        >
          ← Previous
        </span>
      )}

      {/* Page Numbers */}
      <div className="hidden sm:flex items-center gap-2">
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-2 text-text-light dark:text-gray-500"
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <Link
              key={pageNumber}
              href={getPageUrl(pageNumber)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-teal dark:bg-primary-teal text-white'
                  : 'text-text-dark dark:text-dark-text hover:text-primary-teal-text dark:hover:text-primary-teal hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNumber}
            </Link>
          );
        })}
      </div>

      {/* Mobile: Show only current page */}
      <div className="sm:hidden px-4 py-2 text-sm font-medium text-text-dark dark:text-dark-text">
        Page {currentPage} of {totalPages}
      </div>

      {/* Next Button */}
      {hasNext ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="px-4 py-2 text-sm font-medium text-text-dark dark:text-dark-text hover:text-primary-teal-text dark:hover:text-primary-teal hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Go to next page"
        >
          Next →
        </Link>
      ) : (
        <span
          className="px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-600 cursor-not-allowed"
          aria-disabled="true"
        >
          Next →
        </span>
      )}
    </nav>
  );
}

export default Pagination;
