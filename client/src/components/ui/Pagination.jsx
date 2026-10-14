import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Page numbers to display around the current page, with `null` marking a gap. */
function getVisiblePages(current, total) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);

  return sorted.flatMap((page, index) => (index > 0 && page - sorted[index - 1] > 1 ? [null, page] : [page]));
}

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        id="pagination-previous"
        className="pagination__btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {getVisiblePages(page, totalPages).map((pageNumber, index) =>
        pageNumber === null ? (
          <span key={`gap-${index}`} className="pagination__gap" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={pageNumber}
            type="button"
            className={`pagination__btn ${pageNumber === page ? 'pagination__btn--active' : ''}`}
            onClick={() => onPageChange(pageNumber)}
            aria-current={pageNumber === page ? 'page' : undefined}
            aria-label={`Page ${pageNumber}`}
          >
            {pageNumber}
          </button>
        ),
      )}

      <button
        type="button"
        id="pagination-next"
        className="pagination__btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
