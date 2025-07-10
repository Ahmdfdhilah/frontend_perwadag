import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { LaporanHasilEvaluasi } from '@/mocks/laporanHasilEvaluasi';
import ActionDropdown from '@/components/common/ActionDropdown';
import { formatIndonesianDateRange } from '@/utils/timeFormat';

interface LaporanHasilEvaluasiCardsProps {
  data: LaporanHasilEvaluasi[];
  onView?: (item: LaporanHasilEvaluasi) => void;
  onEdit?: (item: LaporanHasilEvaluasi) => void;
  canEdit?: (item: LaporanHasilEvaluasi) => boolean;
}

const LaporanHasilEvaluasiCards: React.FC<LaporanHasilEvaluasiCardsProps> = ({
  data,
  onView,
  onEdit,
  canEdit,
}) => {

  const getMatriksBadgeVariant = (matriks: string) => {
    switch (matriks) {
      case 'Sangat Baik':
        return 'default';
      case 'Baik':
        return 'secondary';
      case 'Cukup':
        return 'outline';
      case 'Kurang':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Tidak ada data laporan hasil evaluasi yang ditemukan.
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
                <span className="font-medium text-muted-foreground">Tanggal Laporan:</span>
                <span className="ml-2">{formatIndonesianDateRange(item.tanggalMulaiEvaluasi, item.tanggalAkhirEvaluasi)}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Matriks:</span>
                <Badge 
                  variant={getMatriksBadgeVariant(item.matriks)}
                  className="ml-2"
                >
                  {item.matriks}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LaporanHasilEvaluasiCards;