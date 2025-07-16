import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { SuratPemberitahuanResponse } from '@/services/suratPemberitahuan/types';
import ActionDropdown from '@/components/common/ActionDropdown';
import { formatIndonesianDate, formatIndonesianDateRange } from '@/utils/timeFormat';

interface SuratPemberitahuanCardsProps {
  data: SuratPemberitahuanResponse[];
  loading?: boolean;
  onView?: (item: SuratPemberitahuanResponse) => void;
  onEdit?: (item: SuratPemberitahuanResponse) => void;
  canEdit?: (item: SuratPemberitahuanResponse) => boolean;
}

const SuratPemberitahuanCards: React.FC<SuratPemberitahuanCardsProps> = ({
  data,
  loading = false,
  onView,
  onEdit,
  canEdit,
}) => {

  const getStatusBadge = (suratPemberitahuan: SuratPemberitahuanResponse) => {
    const isCompleted = suratPemberitahuan.is_completed;
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
        Loading surat pemberitahuan...
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
        <Card key={item.id} className="w-full">
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
                  <span className="ml-2">{index + 1}</span>
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