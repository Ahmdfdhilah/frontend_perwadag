import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { SuratPemberitahuan } from '@/mocks/suratPemberitahuan';
import ActionDropdown from '@/components/common/ActionDropdown';
import { formatIndonesianDate, formatIndonesianDateRange } from '@/utils/timeFormat';

interface SuratPemberitahuanCardsProps {
  data: SuratPemberitahuan[];
  onView?: (item: SuratPemberitahuan) => void;
  onEdit?: (item: SuratPemberitahuan) => void;
  canEdit?: (item: SuratPemberitahuan) => boolean;
}

const SuratPemberitahuanCards: React.FC<SuratPemberitahuanCardsProps> = ({
  data,
  onView,
  onEdit,
  canEdit,
}) => {


  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Tidak ada data surat pemberitahuan yang ditemukan.
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
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-muted-foreground">No:</span>
                  <span className="ml-2">{index + 1}</span>
                </div>
              </div>

              <div>
                <span className="font-medium text-muted-foreground">Tanggal Surat:</span>
                <span className="ml-2">{formatIndonesianDate(item.tanggalSuratPemberitahuan)}</span>
              </div>

              <div>
                <span className="font-medium text-muted-foreground">Tanggal Evaluasi:</span>
                <span className="ml-2">{formatIndonesianDateRange(item.tanggalMulaiEvaluasi, item.tanggalAkhirEvaluasi)}</span>
              </div>
            </div>

          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SuratPemberitahuanCards;