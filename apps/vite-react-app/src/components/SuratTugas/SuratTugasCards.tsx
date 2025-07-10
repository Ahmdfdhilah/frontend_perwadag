import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { SuratTugas } from '@/mocks/suratTugas';
import ActionDropdown from '@/components/common/ActionDropdown';
import { formatIndonesianDateRange } from '@/utils/timeFormat';

interface SuratTugasCardsProps {
  data: SuratTugas[];
  onView?: (item: SuratTugas) => void;
  onEdit?: (item: SuratTugas) => void;
  onDelete?: (item: SuratTugas) => void;
  isPerwadag?: boolean;
}

const SuratTugasCards: React.FC<SuratTugasCardsProps> = ({
  data,
  onView,
  onEdit,
  onDelete,
  isPerwadag = false,
}) => {

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Tidak ada data surat tugas yang ditemukan.
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
                onEdit={onEdit && !isPerwadag ? () => onEdit(item) : undefined}
                onDelete={onDelete && !isPerwadag ? () => onDelete(item) : undefined}
                showView={true}
                showEdit={!isPerwadag && !!onEdit}
                showDelete={!isPerwadag && !!onDelete}
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
                <div>
                  <span className="font-medium text-muted-foreground">Tanggal Evaluasi:</span>
                  <span className="ml-2">{formatIndonesianDateRange(item.tanggalMulaiEvaluasi, item.tanggalAkhirEvaluasi)}</span>
                </div>
              </div>
              
              <div>
                <span className="font-medium text-muted-foreground">No Surat:</span>
                <span className="ml-2">{item.nomor}</span>
              </div>
              
              <div>
                <span className="font-medium text-muted-foreground">Pengendali Mutu:</span>
                <span className="ml-2">{item.pengendaliMutu}</span>
              </div>
              
              <div>
                <span className="font-medium text-muted-foreground">Pengendali Teknis:</span>
                <span className="ml-2">{item.pengendaliTeknis}</span>
              </div>
              
              <div>
                <span className="font-medium text-muted-foreground">Ketua Tim:</span>
                <span className="ml-2">{item.ketuaTim}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SuratTugasCards;