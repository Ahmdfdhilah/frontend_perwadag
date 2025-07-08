import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { EntryMeeting } from '@/mocks/entryMeeting';
import ActionDropdown from '@/components/common/ActionDropdown';

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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Tidak ada data entry meeting yang ditemukan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((item, index) => (
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
                <span className="font-medium text-muted-foreground">Tanggal:</span>
                <span className="ml-2">{formatDate(item.tanggal)}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Rincian:</span>
                <span className="ml-2 block mt-1">{item.rincian}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EntryMeetingCards;