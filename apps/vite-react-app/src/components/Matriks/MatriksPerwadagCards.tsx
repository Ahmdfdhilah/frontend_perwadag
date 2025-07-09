import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Matriks } from '@/mocks/matriks';

interface MatriksPerwadagCardsProps {
  data: Matriks[];
}

const MatriksPerwadagCards: React.FC<MatriksPerwadagCardsProps> = ({
  data,
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
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">No:</span>
                <span className="ml-2">{index + 1}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Tanggal:</span>
                <span className="ml-2">{formatDate(item.tanggal)}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Temuan:</span>
                <p className="mt-1 text-foreground leading-relaxed">{item.temuan}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Rekomendasi:</span>
                <p className="mt-1 text-foreground leading-relaxed">{item.rekomendasi}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MatriksPerwadagCards;