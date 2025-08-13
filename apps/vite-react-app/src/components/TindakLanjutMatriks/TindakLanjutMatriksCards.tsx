import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import ActionDropdown from '@/components/common/ActionDropdown';
import FileViewLink from '@/components/common/FileViewLink';
import { MatriksResponse, TindakLanjutStatus } from '@/services/matriks/types';
import { formatIndonesianDateRange } from '@/utils/timeFormat';

interface TindakLanjutMatriksCardsProps {
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

const TindakLanjutMatriksCards: React.FC<TindakLanjutMatriksCardsProps> = ({
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

  const getTindakLanjutStatusBadge = (status?: TindakLanjutStatus) => {
    switch (status) {
      case 'DRAFTING':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
            Draft Tindak Lanjut
          </span>
        );
      case 'CHECKING':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            Review Ketua Tim
          </span>
        );
      case 'VALIDATING':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            Review Pengendali
          </span>
        );
      case 'FINISHED':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Selesai
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
            Belum Ada Tindak Lanjut
          </span>
        );
    }
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

  // Get tindak lanjut progress

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
        Tidak ada data tindak lanjut matriks yang ditemukan.
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
                <span className="font-medium text-muted-foreground">Status Tindak Lanjut:</span>
                <span className="ml-2">
                  {getTindakLanjutStatusBadge(item.status_tindak_lanjut)}
                </span>
              </div>

              <div>
                <span className="font-medium text-muted-foreground">Dokumen:</span>
                <span className="ml-2">{renderDocumentLink(item)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TindakLanjutMatriksCards;