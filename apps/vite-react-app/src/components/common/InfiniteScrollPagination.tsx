import React, { useState, useCallback } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';

interface InfiniteScrollPaginationProps<T> {
  items: T[];
  total: number;
  currentPage: number;
  hasNext: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  loadMoreText?: string;
  noItemsText?: string;
  itemsPerPage?: number;
}

function InfiniteScrollPagination<T>({
  items,
  total,
  hasNext,
  isLoading,
  onLoadMore,
  renderItem,
  className,
  loadMoreText = "Lihat lebih banyak",
  noItemsText = "Tidak ada data",
}: InfiniteScrollPaginationProps<T>) {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || isLoadingMore || (!hasNext && items.length >= total)) return;
    
    setIsLoadingMore(true);
    try {
      await onLoadMore();
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoading, isLoadingMore, hasNext, items.length, total, onLoadMore]);

  if (!isLoading && items.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        {noItemsText}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Items */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index}>{renderItem(item, index)}</div>
        ))}
      </div>

      {/* Load More Button */}
      {hasNext && !isLoading && items.length < total && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            variant="link"
            className="text-primary hover:text-primary/80 underline underline-offset-4 hover:no-underline"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memuat...
              </>
            ) : (
              loadMoreText
            )}
          </Button>
        </div>
      )}

      {/* Loading State for Initial Load */}
      {isLoading && items.length === 0 && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
    </div>
  );
}

export default InfiniteScrollPagination;