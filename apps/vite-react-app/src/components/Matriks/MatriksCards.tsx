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
  canEdit?: (item: MatriksResponse) => boolean;
  canView?: (item: MatriksResponse) => boolean;
  userRole: 'admin' | 'inspektorat' | 'perwadag';
}

const MatriksCards: React.FC<MatriksCardsProps> = ({
  data,
  loading = false,
  onEdit,
  onView,
  onExport,
  canEdit,
  canView,
  userRole,
}) => {

  const getStatusBadge = (matriks: MatriksResponse) => {
    const isCompleted = matriks.is_completed;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${isCompleted
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800'
        }`}>
        {isCompleted ? 'Lengkap' : 'Belum Lengkap'}
      </span>
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

  const renderAdminInspektoratCard = (item: MatriksResponse, index: number) => (
    <Card key={item.id} className="w-full gap-0">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">
            {item.nama_perwadag}
          </CardTitle>
          {(canEdit?.(item) || canView?.(item) || onExport) && (
            <ActionDropdown
              onEdit={() => onEdit?.(item)}
              onView={() => onView?.(item)}
              onExport={() => onExport?.(item)}
              showView={!!onView && !!canView?.(item)}
              showEdit={!!onEdit && !!canEdit?.(item)}
              showExport={!!onExport}
              showDelete={false}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium text-muted-foreground">No:</span>
            <span className="ml-2">{index + 1}</span>
          </div>

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

          <div>
            <span className="font-medium text-muted-foreground">Kelengkapan:</span>
            <span className="ml-2 text-xs text-muted-foreground">
              {item.completion_percentage || 0}% lengkap
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPerwadagCard = (item: MatriksResponse, index: number) => (
    <Card key={item.id} className="w-full gap-0">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">
            Matriks #{index + 1}
          </CardTitle>
          {(canEdit?.(item) || canView?.(item) || onExport) && (
            <ActionDropdown
              onEdit={() => onEdit?.(item)}
              onView={() => onView?.(item)}
              onExport={() => onExport?.(item)}
              showView={!!onView && !!canView?.(item)}
              showEdit={!!onEdit && !!canEdit?.(item)}
              showExport={!!onExport}
              showDelete={false}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 text-sm">
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
  );

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((item, index) => (
        userRole === 'perwadag'
          ? renderPerwadagCard(item, index)
          : renderAdminInspektoratCard(item, index)
      ))}
    </div>
  );
};

export default MatriksCards;