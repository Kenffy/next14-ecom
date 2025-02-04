import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  goToPage: (value: number) => void;
}

export default function CustomPagination({ currentPage, totalPages, totalRecords, goToPage }: PaginationProps) {

  const handlePage = (page: number) => {
    if (page < 1 || page > totalPages) return; // Prevent invalid page navigation
    goToPage(page);
  };

  return (
    <Pagination className="w-fit text-sm">
      <PaginationContent>
        {/* Previous Page */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => handlePage(currentPage - 1)}
            //disabled={currentPage === 1}
          />
        </PaginationItem>

        {/* First Page */}
        {currentPage > 2 && (
          <PaginationItem>
            <PaginationLink href="#" onClick={() => handlePage(1)}>
              1
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Ellipsis before current page */}
        {currentPage > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Current Page and Nearby Pages */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(
            (page) =>
              page === currentPage || // Current page
              page === currentPage - 1 || // Previous page
              page === currentPage + 1 // Next page
          )
          .map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={() => handlePage(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

        {/* Ellipsis after current page */}
        {currentPage < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Last Page */}
        {currentPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationLink href="#" onClick={() => handlePage(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Next Page */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => handlePage(currentPage + 1)}
            //disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
