import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { Kuesioner } from '@/mocks/kuesioner';
import ActionDropdown from '@/components/common/ActionDropdown';

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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getAspekBadgeVariant = (aspek: string) => {
    switch (aspek) {
      case 'Tata Kelola Keuangan':
        return 'default';
      case 'Manajemen SDM':
        return 'secondary';
      case 'Promosi Dagang':
        return 'outline';
      case 'Fasilitasi Ekspor':
        return 'destructive';
      case 'Pelayanan Konsular':
        return 'default';
      case 'Administrasi Umum':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

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
                <span className="font-medium text-muted-foreground">Tanggal:</span>
                <span className="ml-2">{formatDate(item.tanggal)}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Aspek:</span>
                <Badge 
                  variant={getAspekBadgeVariant(item.aspek)}
                  className="ml-2"
                >
                  {item.aspek}
                </Badge>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Link Dokumen:</span>
                {item.linkDokumen ? (
                  <a
                    href={item.linkDokumen}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    View Document
                  </a>
                ) : (
                  <span className="ml-2 text-muted-foreground">-</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KuesionerCards;