import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import ActionDropdown from '@/components/common/ActionDropdown';
import FileViewLink from '@/components/common/FileViewLink';
import { MatriksResponse, MatriksStatus } from '@/services/matriks/types';
import { formatIndonesianDateRange } from '@/utils/timeFormat';
import { Badge } from '@workspace/ui/components/badge';

interface MatriksCardsProps {
  data: MatriksResponse[];
  loading?: boolean;
  onEdit?: (item: MatriksResponse) => void;
  onView?: (item: MatriksResponse) => void;
  onExport?: (item: MatriksResponse) => void;
  canEdit?: (item: MatriksResponse) => boolean;
  userRole: 'admin' | 'inspektorat' | 'perwadag';
  currentPage?: number;
  itemsPerPage?: number;
}

const MatriksCards: React.FC<MatriksCardsProps> = ({
  data,
  loading = false,
  onEdit,
  onView,
  onExport,
  canEdit,
  userRole,
  currentPage = 1,
  itemsPerPage = 10,
}) => {

  // Get status badge variant
  const getStatusVariant = (status?: MatriksStatus) => {
    switch (status) {
      case 'DRAFTING': return 'secondary';
      case 'CHECKING': return 'outline';
      case 'VALIDATING': return 'default';
      case 'FINISHED': return 'default';
      default: return 'secondary';
    }
  };

  // Get status label
  const getStatusLabel = (status?: MatriksStatus) => {
    switch (status) {
      case 'DRAFTING': return 'Draft';
      case 'CHECKING': return 'Review Ketua Tim';
      case 'VALIDATING': return 'Review Pengendali';
      case 'FINISHED': return 'Selesai';
      default: return 'Draft';
    }
  };

  const getStatusBadge = (matriks: MatriksResponse) => {
    return (
      <Badge variant={getStatusVariant(matriks.status)}>
        {getStatusLabel(matriks.status)}
      </Badge>
    );
  };


  const renderDocumentLink = (matriks: MatriksResponse) => {
    return (
      <FileViewLink
        hasFile={matriks.has_file}
        fileUrls={matriks.file_urls}
        fileName={matriks.file_metadata?.original_filename}
        linkText="Lihat Dokumen"
      />
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-8 w-24" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 text-sm">
                <div>
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-8 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

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
        <Card key={item.id} className="w-full gap-0">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold">
                {item.nama_perwadag}
              </CardTitle>
              <ActionDropdown
                onView={() => onView?.(item)}
                onEdit={canEdit?.(item) ? () => onEdit?.(item) : undefined}
                onExport={() => onExport?.(item)}
                showView={true}
                showEdit={canEdit?.(item) && !!onEdit}
                showExport={!!onExport}
                showDelete={false}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 text-sm">
              {userRole !== 'perwadag' && (
                <div>
                  <span className="font-medium text-muted-foreground">No:</span>
                  <span className="ml-2">{(currentPage - 1) * itemsPerPage + index + 1}</span>
                </div>
              )}

              <div>
                <span className="font-medium text-muted-foreground">Tanggal Evaluasi:</span>
                <span className="ml-2">{formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai)}</span>
              </div>

              <div>
                <span className="font-medium text-muted-foreground">Dokumen:</span>
                <span className="ml-2">{renderDocumentLink(item)}</span>
              </div>

              <div>
                <span className="font-medium text-muted-foreground">Status:</span>
                <span className="ml-2">
                  {getStatusBadge(item)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MatriksCards;