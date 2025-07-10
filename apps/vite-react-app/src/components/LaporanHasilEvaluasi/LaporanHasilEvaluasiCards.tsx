import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { LaporanHasilEvaluasi, getLaporanHasilEvaluasiStatus } from '@/mocks/laporanHasilEvaluasi';
import ActionDropdown from '@/components/common/ActionDropdown';
import { formatIndonesianDateRange, formatIndonesianDate } from '@/utils/timeFormat';

interface LaporanHasilEvaluasiCardsProps {
  data: LaporanHasilEvaluasi[];
  onView?: (item: LaporanHasilEvaluasi) => void;
  onEdit?: (item: LaporanHasilEvaluasi) => void;
  canEdit?: (item: LaporanHasilEvaluasi) => boolean;
}

const LaporanHasilEvaluasiCards: React.FC<LaporanHasilEvaluasiCardsProps> = ({
  data,
  onView,
  onEdit,
  canEdit,
}) => {


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
                {item.perwadagName}
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
                <span className="font-medium text-muted-foreground">Tanggal Evaluasi:</span>
                <span className="ml-2">{formatIndonesianDateRange(item.tanggalMulaiEvaluasi, item.tanggalAkhirEvaluasi)}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Nomor Laporan:</span>
                <span className="ml-2">{item.nomorEvaluasi}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Tanggal Laporan:</span>
                <span className="ml-2">{formatIndonesianDate(item.tanggal)}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Laporan Hasil Evaluasi:</span>
                {item.uploadFile ? (
                  <a 
                    href={item.uploadFileUrl || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    {item.uploadFile}
                  </a>
                ) : (
                  <span className="ml-2 text-muted-foreground">Tidak ada file</span>
                )}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  getLaporanHasilEvaluasiStatus(item) === 'Sudah Upload' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {getLaporanHasilEvaluasiStatus(item)}
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