import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Matriks } from '@/mocks/matriks';
import { formatIndonesianDateRange } from '@/utils/timeFormat';

interface MatriksPerwadagCardsProps {
  data: Matriks[];
}

const MatriksPerwadagCards: React.FC<MatriksPerwadagCardsProps> = ({
  data,
}) => {

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Tidak ada data matriks yang ditemukan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((item, index) => (
        <Card key={item.id} className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">
              {item.perwadagName}
            </CardTitle>
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
                <span className="font-medium text-muted-foreground">Dokumen:</span>
                {item.uploadFile ? (
                  <a 
                    href={item.uploadFileUrl || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    Lihat Dokumen
                  </a>
                ) : (
                  <span className="ml-2 text-muted-foreground">Tidak ada dokumen</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MatriksPerwadagCards;