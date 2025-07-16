import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { KuisionerResponse } from '@/services/kuisioner/types';
import ActionDropdown from '@/components/common/ActionDropdown';
import { formatIndonesianDateRange, formatIndonesianDate } from '@/utils/timeFormat';

interface KuesionerCardsProps {
  data: KuisionerResponse[];
  loading?: boolean;
  onView?: (item: KuisionerResponse) => void;
  onEdit?: (item: KuisionerResponse) => void;
  canEdit?: (item: KuisionerResponse) => boolean;
}

const KuesionerCards: React.FC<KuesionerCardsProps> = ({
  data,
  loading = false,
  onView,
  onEdit,
  canEdit,
}) => {

  const getStatusBadge = (kuisioner: KuisionerResponse) => {
    const isCompleted = kuisioner.is_completed;
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
        Loading kuisioner...
      </div>
    );
  }


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
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">No:</span>
                <span className="ml-2">{index + 1}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Tanggal Kuesioner:</span>
                <span className="ml-2">{item.tanggal_kuisioner ? formatIndonesianDate(item.tanggal_kuisioner) : '-'}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Tanggal Evaluasi:</span>
                <span className="ml-2">{formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai)}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Dokumen:</span>
                {item.has_file ? (
                  <a
                    href={item.file_urls?.view_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    Lihat Dokumen
                  </a>
                ) : (
                  <span className="ml-2 text-muted-foreground">Tidak ada file</span>
                )}
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

export default KuesionerCards;