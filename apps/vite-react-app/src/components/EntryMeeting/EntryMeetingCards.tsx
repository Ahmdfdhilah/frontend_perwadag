import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { EntryMeeting, getEntryMeetingStatus } from '@/mocks/entryMeeting';
import ActionDropdown from '@/components/common/ActionDropdown';
import { formatIndonesianDateRange, formatIndonesianDate } from '@/utils/timeFormat';

interface EntryMeetingCardsProps {
  data: EntryMeeting[];
  onView?: (item: EntryMeeting) => void;
  onEdit?: (item: EntryMeeting) => void;
  canEdit?: (item: EntryMeeting) => boolean;
}

const EntryMeetingCards: React.FC<EntryMeetingCardsProps> = ({
  data,
  onView,
  onEdit,
  canEdit,
}) => {

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Tidak ada data entry meeting yang ditemukan.
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Lengkap': return 'default';
      case 'Sebagian': return 'secondary';
      case 'Belum Upload': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((item, index) => {
        const status = getEntryMeetingStatus(item);

        return (
          <Card key={item.id} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold">
                  {item.perwadagName}
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
                  <span className="ml-2">{formatIndonesianDateRange(item.tanggalMulaiEvaluasi, item.tanggalAkhirEvaluasi)}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Tanggal Entry Meeting:</span>
                  <span className="ml-2">{formatIndonesianDate(item.tanggal)}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Link Zoom:</span>
                  {item.linkZoom ? (
                    <a
                      href={item.linkZoom}
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
                  <span className="font-medium text-muted-foreground">Status:</span>
                  <Badge
                    variant={getStatusBadgeVariant(status)}
                    className="ml-2"
                  >
                    {status}
                  </Badge>
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