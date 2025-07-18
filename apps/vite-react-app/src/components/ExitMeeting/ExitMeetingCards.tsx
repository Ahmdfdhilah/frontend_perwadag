import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { MeetingResponse } from '@/services/meeting/types';
import ActionDropdown from '@/components/common/ActionDropdown';
import { formatIndonesianDateRange, formatIndonesianDate } from '@/utils/timeFormat';

interface ExitMeetingCardsProps {
  data: MeetingResponse[];
  loading?: boolean;
  onView?: (item: MeetingResponse) => void;
  onEdit?: (item: MeetingResponse) => void;
  canEdit?: (item: MeetingResponse) => boolean;
}

const ExitMeetingCards: React.FC<ExitMeetingCardsProps> = ({
  data,
  loading = false,
  onView,
  onEdit,
  canEdit,
}) => {
  
  const getStatusBadge = (meeting: MeetingResponse) => {
    const isCompleted = meeting.is_completed;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        isCompleted
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isCompleted ? 'Lengkap' : 'Belum Lengkap'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Loading meetings...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Tidak ada data exit meeting yang ditemukan.
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
                  <span className="ml-2">{index + 1}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Tanggal Evaluasi:</span>
                  <span className="ml-2">{formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai)}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Tanggal Exit Meeting:</span>
                  <span className="ml-2">{item.tanggal_meeting ? formatIndonesianDate(item.tanggal_meeting) : '-'}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Link Zoom:</span>
                  {item.link_zoom ? (
                    <a
                      href={item.link_zoom}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:text-blue-800 underline"
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
                      className="ml-2 text-blue-600 hover:text-blue-800 underline"
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

export default ExitMeetingCards;