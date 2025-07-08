import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

interface PaginationProps {
  currentPage: number;
  totalPages?: number; // Made optional since we might not always know total pages
  itemsPerPage: number;
  totalItems?: number; // Made optional for cases where total count is unknown
  hasNext?: boolean; // New parameter to indicate if there's a next page
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: string) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  hasNext = false,
  onPageChange,
  onItemsPerPageChange,
}) => {
  // Determine if we should show page numbers or simplified navigation
  const showPageNumbers = totalPages !== undefined && totalPages > 0;
  
  const getPageNumbers = () => {
    if (!showPageNumbers) return [];
    
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages! <= maxPagesToShow) {
      // Show all pages if total pages is less than max pages to show
      for (let i = 1; i <= totalPages!; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of page numbers to show
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages! - 1, currentPage + 1);

      // Adjust if we're at the start or end
      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages! - 1) {
        startPage = totalPages! - 3;
      }

      // Add ellipsis if needed before middle pages
      if (startPage > 2) {
        pageNumbers.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if needed after middle pages
      if (endPage < totalPages! - 1) {
        pageNumbers.push("...");
      }

      // Always show last page
      pageNumbers.push(totalPages!);
    }

    return pageNumbers;
  };

  // Calculate display information
  const startItem = totalItems && totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : currentPage * itemsPerPage;
  
  // Determine if next button should be disabled
  const isNextDisabled = showPageNumbers ? currentPage >= totalPages! : !hasNext;

  return (
    <div className="w-full pt-8">
      <div className="p-4 border border-secondary rounded-md bg-primary text-secondary">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <span className="text-sm text-secondary">
              {totalItems !== undefined ? (
                `Showing ${startItem} - ${endItem} of ${totalItems} entries`
              ) : (
                `Showing ${startItem} - ${endItem} entries`
              )}
            </span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={onItemsPerPageChange}
            >
              <SelectTrigger className="w-20 h-8 border-secondary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map((size) => (
                  <SelectItem
                    key={size}
                    value={size.toString()}
                  >
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 border-secondary"
            >
              <ChevronLeft className="h-4 w-4 text-primary" />
            </Button>

            {showPageNumbers ? (
              // Show numbered pagination when total pages is known
              getPageNumbers().map((page, index) =>
                typeof page === "number" ? (
                  <Button
                    key={index}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className={`h-8 w-8 p-0 ${currentPage === page
                        ? "bg-primary hover:bg-primary/50 border-secondary text-secondary"
                        : "bg-secondary border-primary hover:bg-secondary/50 text-primary"
                      }`}
                  >
                    {page}
                  </Button>
                ) : (
                  <span
                    key={index}
                    className="mx-1 text-secondary"
                  >
                    ...
                  </span>
                )
              )
            ) : (
              // Show current page when total pages is unknown
              <div className="flex items-center space-x-2">
                <span className="text-sm text-secondary px-2">
                  Page {currentPage}
                </span>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={isNextDisabled}
              className="h-8 w-8 p-0 border-secondary"
            >
              <ChevronRight className="h-4 w-4 text-primary" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;