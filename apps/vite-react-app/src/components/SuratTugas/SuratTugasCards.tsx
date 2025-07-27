import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { SuratTugasResponse } from '@/services/suratTugas/types';
import ActionDropdown from '@/components/common/ActionDropdown';
import FileViewLink from '@/components/common/FileViewLink';
import { formatIndonesianDateRange } from '@/utils/timeFormat';

interface SuratTugasCardsProps {
  data: SuratTugasResponse[];
  loading?: boolean;
  onView?: (item: SuratTugasResponse) => void;
  onEdit?: (item: SuratTugasResponse) => void;
  onDelete?: (item: SuratTugasResponse) => void;
  canEdit?: (item: SuratTugasResponse) => boolean;
  canDelete?: (item: SuratTugasResponse) => boolean;
  isPerwadag?: boolean;
  isDashboard?: boolean;
  currentPage?: number;
  itemsPerPage?: number;
}

const SuratTugasCards: React.FC<SuratTugasCardsProps> = ({
  data,
  loading = false,
  onView,
  onEdit,
  onDelete,
  canEdit = () => true,
  canDelete = () => true,
  isPerwadag = false,
  isDashboard = false,
  currentPage = 1,
  itemsPerPage = 10,
}) => {

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="w-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Skeleton className="h-6 w-48" />
                  {!isDashboard && <Skeleton className="h-8 w-24" />}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-8 mt-1" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-32 mt-1" />
                    </div>
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20 mt-1" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20 mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Tidak ada data surat tugas yang ditemukan.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {data.map((item, index) => (
          <Card key={item.id} className="w-full gap-0">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold">
                  {item.nama_perwadag}
                </CardTitle>
                {!isDashboard && (
                  <ActionDropdown
                    onView={() => onView?.(item)}
                    onEdit={canEdit(item) && onEdit && !isPerwadag ? () => onEdit(item) : undefined}
                    onDelete={canDelete(item) && onDelete && !isPerwadag ? () => onDelete(item) : undefined}
                    showView={true}
                    showEdit={!isPerwadag && !!onEdit && canEdit(item)}
                    showDelete={!isPerwadag && !!onDelete && canDelete(item)}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <span className="font-medium text-muted-foreground">No:</span>
                    <span className="ml-2">{(currentPage - 1) * itemsPerPage + index + 1}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Tanggal Evaluasi:</span>
                    <span className="ml-2">{formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai)}</span>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-muted-foreground">No. Surat Tugas:</span>
                  <span className="ml-2">{item.no_surat}</span>
                </div>

                <div>
                  <span className="font-medium text-muted-foreground">File Surat Tugas:</span>
                  <div className="ml-2">
                    <FileViewLink
                      hasFile={true}
                      fileUrls={{
                        view_url: item.file_surat_tugas_url,
                        file_url: item.file_surat_tugas_url
                      }}
                      fileName="Surat Tugas"
                      linkText="Lihat File"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SuratTugasCards;