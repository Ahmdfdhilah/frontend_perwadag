import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { MeetingResponse } from '@/services/meeting/types';
import ActionDropdown from '@/components/common/ActionDropdown';
import { formatIndonesianDateRange, formatMeetingDate } from '@/utils/timeFormat';

interface EntryMeetingCardsProps {
  data: MeetingResponse[];
  loading?: boolean;
  onView?: (item: MeetingResponse) => void;
  onEdit?: (item: MeetingResponse) => void;
  canEdit?: (item: MeetingResponse) => boolean;
  currentPage?: number;
  itemsPerPage?: number;
}

const EntryMeetingCards: React.FC<EntryMeetingCardsProps> = ({
  data,
  loading = false,
  onView,
  onEdit,
  canEdit,
  currentPage = 1,
  itemsPerPage = 10,
}) => {
  
  const getStatusBadge = (meeting: MeetingResponse) => {
    const isCompleted = meeting.is_completed;
    return (
      <span
  className={`px-2 py-1 rounded-full text-xs font-medium
    ${
      isCompleted
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
    }`}
>
  {isCompleted ? 'Lengkap' : 'Belum Lengkap'}
</span>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-8 w-24" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                <div>
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-8 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-24 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Tidak ada data entry meeting yang ditemukan.
      </div>
    );
  }



  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((item, index) => {
        return (
          <Card key={item.id} className="w-full gap-0">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold">
                  {item.nama_perwadag}
                </CardTitle>
                <ActionDropdown
                  onView={() => onView?.(item)}
                  onEdit={canEdit?.(item) ? () => onEdit?.(item) : undefined}
                  showView={true}
                  showEdit={canEdit?.(item) && !!onEdit}
                  showDelete={false}
                />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">No:</span>
                  <span className="ml-2">{(currentPage - 1) * itemsPerPage + index + 1}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Tanggal Evaluasi:</span>
                  <span className="ml-2">{formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai)}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Tanggal Entry Meeting:</span>
                  <span className="ml-2">{item.tanggal_meeting ? formatMeetingDate(item.tanggal_meeting) : '-'}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Link Zoom:</span>
                  {item.link_zoom ? (
                    <a
                      href={item.link_zoom}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:text-blue-800 underline dark:text-blue-300 dark:hover:text-blue-100"
                    >
                      Join Meeting
                    </a>
                  ) : (
                    <span className="ml-2 text-muted-foreground">-</span>
                  )}
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Daftar Hadir:</span>
                  {item.link_daftar_hadir ? (
                    <a
                      href={item.link_daftar_hadir}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:text-blue-800 underline dark:text-blue-300 dark:hover:text-blue-100"
                    >
                      Lihat Daftar Hadir
                    </a>
                  ) : (
                    <span className="ml-2 text-muted-foreground">-</span>
                  )}
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Status:</span>
                  <span className="ml-2">
                    {getStatusBadge(item)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default EntryMeetingCards;