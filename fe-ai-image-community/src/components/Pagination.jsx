/**
 * 페이지네이션 컴포넌트
 *
 * 이미지 목록 페이지에서 사용하는 페이지 번호 버튼
 */

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // 최대 표시할 페이지 번호 개수

    if (totalPages <= maxPagesToShow) {
      // 전체 페이지가 5개 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지 주변만 표시
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      // 시작 부분 조정
      if (currentPage <= 3) {
        end = maxPagesToShow;
      }

      // 끝 부분 조정
      if (currentPage >= totalPages - 2) {
        start = totalPages - maxPagesToShow + 1;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          flex items-center justify-center w-10 h-10 rounded-full
          ${currentPage === 1
            ? 'opacity-50 cursor-not-allowed bg-surface-light dark:bg-surface-dark'
            : 'bg-surface-light dark:bg-surface-dark hover:bg-primary hover:text-background-dark cursor-pointer'
          }
          transition-colors
        `}
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      {/* 첫 페이지 (필요시) */}
      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-light dark:bg-surface-dark hover:bg-primary hover:text-background-dark transition-colors cursor-pointer"
          >
            1
          </button>
          {pageNumbers[0] > 2 && (
            <span className="text-muted-light dark:text-muted-dark">...</span>
          )}
        </>
      )}

      {/* 페이지 번호들 */}
      {pageNumbers.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            flex items-center justify-center w-10 h-10 rounded-full
            font-medium transition-colors cursor-pointer
            ${page === currentPage
              ? 'bg-primary text-background-dark'
              : 'bg-surface-light dark:bg-surface-dark hover:bg-primary hover:text-background-dark'
            }
          `}
        >
          {page}
        </button>
      ))}

      {/* 마지막 페이지 (필요시) */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="text-muted-light dark:text-muted-dark">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-light dark:bg-surface-dark hover:bg-primary hover:text-background-dark transition-colors cursor-pointer"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* 다음 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          flex items-center justify-center w-10 h-10 rounded-full
          ${currentPage === totalPages
            ? 'opacity-50 cursor-not-allowed bg-surface-light dark:bg-surface-dark'
            : 'bg-surface-light dark:bg-surface-dark hover:bg-primary hover:text-background-dark cursor-pointer'
          }
          transition-colors
        `}
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  );
};

export default Pagination;
