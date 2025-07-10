import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Kuesioner, getKuesionerStatus } from '@/mocks/kuesioner';
import ActionDropdown from '@/components/common/ActionDropdown';
import { formatIndonesianDateRange, formatIndonesianDate } from '@/utils/timeFormat';

interface KuesionerCardsProps {
  data: Kuesioner[];
  onView?: (item: Kuesioner) => void;
  onEdit?: (item: Kuesioner) => void;
  canEdit?: (item: Kuesioner) => boolean;
}

const KuesionerCards: React.FC<KuesionerCardsProps> = ({
  data,
  onView,
  onEdit,
  canEdit,
}) => {


  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Tidak ada data kuesioner yang ditemukan.
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
                <span className="font-medium text-muted-foreground">Tanggal Kuesioner:</span>
                <span className="ml-2">{formatIndonesianDate(item.tanggal)}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Tanggal Evaluasi:</span>
                <span className="ml-2">{formatIndonesianDateRange(item.tanggalMulaiEvaluasi, item.tanggalAkhirEvaluasi)}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Dokumen:</span>
                {item.dokumen ? (
                  <button
                    onClick={() => {
                      console.log('Lihat dokumen:', item.dokumen);
                      // Implement view/download logic here
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    Lihat Dokumen
                  </button>
                ) : (
                  <span className="ml-2 text-muted-foreground">-</span>
                )}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  getKuesionerStatus(item) === 'Tersedia'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {getKuesionerStatus(item)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KuesionerCards;