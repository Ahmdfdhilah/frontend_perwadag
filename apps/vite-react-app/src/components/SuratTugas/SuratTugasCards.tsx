import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { SuratTugasResponse } from '@/services/suratTugas/types';
import ActionDropdown from '@/components/common/ActionDropdown';
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
}) => {

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Loading surat tugas...
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
                onEdit={canEdit(item) && onEdit && !isPerwadag ? () => onEdit(item) : undefined}
                onDelete={canDelete(item) && onDelete && !isPerwadag ? () => onDelete(item) : undefined}
                showView={true}
                showEdit={!isPerwadag && !!onEdit}
                showDelete={!isPerwadag && !!onDelete}
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
                <div>
                  <span className="font-medium text-muted-foreground">Tanggal Evaluasi:</span>
                  <span className="ml-2">{formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai)}</span>
                </div>
              </div>
              
              <div>
                <span className="font-medium text-muted-foreground">No Surat:</span>
                <span className="ml-2">{item.no_surat}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SuratTugasCards;