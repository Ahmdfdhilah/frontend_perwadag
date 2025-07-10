import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { ExitMeeting } from '@/mocks/exitMeeting';
import ActionDropdown from '@/components/common/ActionDropdown';
import { formatIndonesianDateRange, formatIndonesianDate } from '@/utils/timeFormat';

interface ExitMeetingCardsProps {
  data: ExitMeeting[];
  onView?: (item: ExitMeeting) => void;
  onEdit?: (item: ExitMeeting) => void;
  canEdit?: (item: ExitMeeting) => boolean;
}

const ExitMeetingCards: React.FC<ExitMeetingCardsProps> = ({
  data,
  onView,
  onEdit,
  canEdit,
}) => {

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
                  <span className="font-medium text-muted-foreground">Tanggal Exit Meeting:</span>
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
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ExitMeetingCards;