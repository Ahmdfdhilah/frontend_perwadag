import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { LaporanHasilResponse } from '@/services/laporanHasil/types';
import ActionDropdown from '@/components/common/ActionDropdown';
import FileViewLink from '@/components/common/FileViewLink';
import { formatIndonesianDateRange, formatIndonesianDate } from '@/utils/timeFormat';

interface LaporanHasilEvaluasiCardsProps {
  data: LaporanHasilResponse[];
  loading?: boolean;
  onView?: (item: LaporanHasilResponse) => void;
  onEdit?: (item: LaporanHasilResponse) => void;
  onComposeEmail?: (item: LaporanHasilResponse) => void;
  canEdit?: (item: LaporanHasilResponse) => boolean;
}

const LaporanHasilEvaluasiCards: React.FC<LaporanHasilEvaluasiCardsProps> = ({
  data,
  loading = false,
  onView,
  onEdit,
  onComposeEmail,
  canEdit,
}) => {

  const getStatusBadge = (laporan: LaporanHasilResponse) => {
    const isCompleted = laporan.is_completed;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        isCompleted
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isCompleted ? 'Lengkap' : 'Belum Lengkap'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Loading laporan hasil evaluasi...
      </div>
    );
  }


  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Tidak ada data laporan hasil evaluasi yang ditemukan.
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
                {item.nama_perwadag}
              </CardTitle>
              <ActionDropdown
                onView={() => onView?.(item)}
                onEdit={canEdit?.(item) ? () => onEdit?.(item) : undefined}
                onComposeEmail={() => onComposeEmail?.(item)}
                showView={true}
                showEdit={canEdit?.(item) && !!onEdit}
                showDelete={false}
                showComposeEmail={!!onComposeEmail}
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
                <span className="font-medium text-muted-foreground">Tanggal Evaluasi:</span>
                <span className="ml-2">{formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai)}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Nomor Laporan:</span>
                <span className="ml-2">{item.nomor_laporan || '-'}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Tanggal Laporan:</span>
                <span className="ml-2">{item.tanggal_laporan ? formatIndonesianDate(item.tanggal_laporan) : '-'}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Laporan Hasil Evaluasi:</span>
                <span className="ml-2">
                  <FileViewLink
                    hasFile={item.has_file}
                    fileUrls={item.file_urls}
                    fileName={item.file_metadata?.original_filename}
                    linkText="Lihat Dokumen"
                  />
                </span>
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

export default LaporanHasilEvaluasiCards;