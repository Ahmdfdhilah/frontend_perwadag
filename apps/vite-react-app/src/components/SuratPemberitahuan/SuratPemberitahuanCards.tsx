import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { SuratPemberitahuanResponse } from '@/services/suratPemberitahuan/types';
import ActionDropdown from '@/components/common/ActionDropdown';
import FileViewLink from '@/components/common/FileViewLink';
import { formatIndonesianDate, formatIndonesianDateRange } from '@/utils/timeFormat';

interface SuratPemberitahuanCardsProps {
  data: SuratPemberitahuanResponse[];
  loading?: boolean;
  onView?: (item: SuratPemberitahuanResponse) => void;
  onEdit?: (item: SuratPemberitahuanResponse) => void;
  canEdit?: (item: SuratPemberitahuanResponse) => boolean;
  currentPage?: number;
  itemsPerPage?: number;
}

const SuratPemberitahuanCards: React.FC<SuratPemberitahuanCardsProps> = ({
  data,
  loading = false,
  onView,
  onEdit,
  canEdit,
  currentPage = 1,
  itemsPerPage = 10,
}) => {

  const getStatusBadge = (suratPemberitahuan: SuratPemberitahuanResponse) => {
    const isCompleted = suratPemberitahuan.is_completed;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium
    ${isCompleted
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
          }`}
      >
        {isCompleted ? 'Lengkap' : 'Belum Lengkap'}
      </span>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-8 mt-1" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16 mt-1" />
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
        Tidak ada data surat pemberitahuan yang ditemukan.
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
                showView={true}
                showEdit={canEdit?.(item) && !!onEdit}
                showDelete={false}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-muted-foreground">No:</span>
                  <span className="ml-2">{(currentPage - 1) * itemsPerPage + index + 1}</span>
                </div>
              </div>

              <div>
                <span className="font-medium text-muted-foreground">Tanggal Surat:</span>
                <span className="ml-2">{item.tanggal_surat_pemberitahuan ? formatIndonesianDate(item.tanggal_surat_pemberitahuan) : '-'}</span>
              </div>

              <div>
                <span className="font-medium text-muted-foreground">Tanggal Evaluasi:</span>
                <span className="ml-2">{formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai)}</span>
              </div>

              <div>
                <span className="font-medium text-muted-foreground">File Surat Pemberitahuan:</span>
                <div className="ml-2">
                  <FileViewLink
                    hasFile={item.has_file}
                    fileUrls={{
                      view_url: item.file_urls?.view_url,
                      file_url: item.file_urls?.file_url
                    }}
                    fileName="Surat Pemberitahuan"
                    linkText="Lihat File"
                    className="text-sm truncate max-w-48 text-primary hover:text-primary/80 underline"
                  />
                </div>
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

export default SuratPemberitahuanCards;