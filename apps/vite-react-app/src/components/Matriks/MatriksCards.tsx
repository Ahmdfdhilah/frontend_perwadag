import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import ActionDropdown from '@/components/common/ActionDropdown';
import FileViewLink from '@/components/common/FileViewLink';
import { MatriksResponse } from '@/services/matriks/types';
import { formatIndonesianDateRange } from '@/utils/timeFormat';

interface MatriksCardsProps {
  data: MatriksResponse[];
  loading?: boolean;
  onEdit?: (item: MatriksResponse) => void;
  onView?: (item: MatriksResponse) => void;
  onExport?: (item: MatriksResponse) => void;
  onDownloadPdf?: (item: MatriksResponse) => void;
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
  onDownloadPdf,
  canEdit,
  userRole,
  currentPage = 1,
  itemsPerPage = 10,
}) => {

  // Get appropriate action label based on user role and item status
  const getActionLabel = (item: MatriksResponse): { editLabel: string; viewLabel: string } => {
    const canUserEdit = canEdit?.(item);
    
    if (!canUserEdit) {
      return { editLabel: 'Edit', viewLabel: 'Lihat' };
    }

    // For users who can edit, determine action based on role and status
    switch (item.status) {
      case 'DRAFTING':
        return { editLabel: 'Edit', viewLabel: 'Lihat' };
      case 'CHECKING':
        return { editLabel: 'Review', viewLabel: 'Lihat' };
      case 'VALIDATING':
        return { editLabel: 'Review', viewLabel: 'Lihat' };
      case 'APPROVING':
        return { editLabel: 'Review', viewLabel: 'Lihat' };
      case 'FINISHED':
        return { editLabel: 'Edit', viewLabel: 'Lihat' };
      default:
        return { editLabel: 'Edit', viewLabel: 'Lihat' };
    }
  };

  const getStatusBadge = (matriks: MatriksResponse) => {
    const status = matriks.status;
    switch (status) {
      case 'DRAFTING':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
            Draft
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
      case 'APPROVING':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
            Review Pengedali Mutu
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
            Draft
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
        className="text-sm truncate max-w-48 text-primary hover:text-primary/80 underline"
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
              {(() => {
                const { editLabel, viewLabel } = getActionLabel(item);
                return (
                  <ActionDropdown
                    onView={!canEdit?.(item) ? () => onView?.(item) : undefined}
                    onEdit={canEdit?.(item) ? () => onEdit?.(item) : undefined}
                    onExport={() => onExport?.(item)}
                    onDownloadPdf={item.status === 'FINISHED' && userRole != 'perwadag' ? () => onDownloadPdf?.(item) : undefined}
                    showView={!canEdit?.(item) && !!onView}
                    showEdit={canEdit?.(item) && !!onEdit}
                    showExport={!!onExport}
                    showDownloadPdf={item.status === 'FINISHED' && userRole != 'perwadag' && !!onDownloadPdf}
                    showDelete={false}
                    editLabel={editLabel}
                    viewLabel={viewLabel}
                  />
                );
              })()} 
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