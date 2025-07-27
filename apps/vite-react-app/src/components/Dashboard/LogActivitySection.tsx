import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Activity, Clock, User, Globe } from 'lucide-react';
import { logActivityService } from '@/services/log-activity';
import { LogActivityResponse, LogActivityFilterParams } from '@/services/log-activity/types';
import SearchContainer from '@/components/common/SearchContainer';
import InfiniteScrollPagination from '@/components/common/InfiniteScrollPagination';
import { useDebounce } from '@/hooks/useDebounce';
import { formatIndonesianDateTime } from '@/utils/timeFormat';

interface LogActivitySectionProps {
  className?: string;
  searchQuery?: string;
  onSearchChange?: (search: string) => void;
}

const LogActivitySection: React.FC<LogActivitySectionProps> = ({ 
  className, 
  searchQuery: externalSearchQuery, 
  onSearchChange 
}) => {
  const [logActivities, setLogActivities] = useState<LogActivityResponse[]>([]);
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    size: 10
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchLogActivities = useCallback(async (page: number = 1, reset: boolean = true) => {
    try {
      if (reset) setIsLoading(true);

      const filters: LogActivityFilterParams = {
        page,
        size: pagination.size,
        search: debouncedSearchQuery || undefined,
      };

      const response = await logActivityService.getAllLogActivities(filters);

      if (reset) {
        setLogActivities(response.items);
      } else {
        setLogActivities(prev => [...prev, ...response.items]);
      }

      setPagination({
        page: response.page,
        pages: response.pages,
        total: response.total,
        hasNext: response.page < response.pages,
        size: response.size
      });
    } catch (error) {
      console.error('Error fetching log activities:', error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, pagination.size]);

  const handleLoadMore = useCallback(() => {
    if (pagination.hasNext) {
      fetchLogActivities(pagination.page + 1, false);
    }
  }, [fetchLogActivities, pagination.hasNext, pagination.page]);

  useEffect(() => {
    fetchLogActivities(1, true);
  }, [debouncedSearchQuery]);



  const renderLogActivity = (log: LogActivityResponse) => (
    <div
      key={log.id}
      className="flex flex-col p-4 rounded-lg border bg-card space-y-3"
    >
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between">
          <span className="text-sm font-medium leading-relaxed">
            {log.activity}
          </span>
        </div>

        <div className="flex flex-col space-y-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 sm:text-sm">
          <div className="flex items-center space-x-1">
            <User className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
            <span className="truncate">{log.user_name || 'Unknown User'}</span>
          </div>
          
          {log.ip_address && (
            <div className="flex items-center space-x-1">
              <Globe className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
              <span className="font-mono text-xs sm:text-sm">{log.ip_address}</span>
            </div>
          )}

          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">
              {formatIndonesianDateTime(log.date)} WIB
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span className="text-base sm:text-lg">Log Aktivitas Terbaru</span>
          </div>
        </CardTitle>
        <div className="pt-2">
          <SearchContainer
            searchQuery={searchQuery}
            onSearchChange={onSearchChange || setInternalSearchQuery}
            placeholder="Cari aktivitas, user, atau URL..."
            className="w-full sm:max-w-md"
          />
        </div>
      </CardHeader>
      <CardContent>
        <InfiniteScrollPagination
          items={logActivities}
          total={pagination.total}
          currentPage={pagination.page}
          hasNext={pagination.hasNext}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          renderItem={renderLogActivity}
          loadMoreText="Lihat lebih banyak aktivitas"
          noItemsText="Tidak ada aktivitas ditemukan"
        />
      </CardContent>
    </Card>
  );
};

export default LogActivitySection;