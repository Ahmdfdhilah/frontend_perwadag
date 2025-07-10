import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { Badge } from '@workspace/ui/components/badge';
import ActionDropdown from '@/components/common/ActionDropdown';
import { LaporanHasilEvaluasi } from '@/mocks/laporanHasilEvaluasi';
import { formatIndonesianDateRange, formatIndonesianDate } from '@/utils/timeFormat';

interface LaporanHasilEvaluasiTableProps {
  data: LaporanHasilEvaluasi[];
  onView?: (item: LaporanHasilEvaluasi) => void;
  onEdit?: (item: LaporanHasilEvaluasi) => void;
  canEdit?: (item: LaporanHasilEvaluasi) => boolean;
}

const LaporanHasilEvaluasiTable: React.FC<LaporanHasilEvaluasiTableProps> = ({
  data,
  onView,
  onEdit,
  canEdit,
}) => {

  const getMatriksBadgeVariant = (matriks: string) => {
    switch (matriks) {
      case 'Sangat Baik':
        return 'default';
      case 'Baik':
        return 'secondary';
      case 'Cukup':
        return 'outline';
      case 'Kurang':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Tanggal Laporan</TableHead>
            <TableHead>Tanggal Evaluasi</TableHead>
            <TableHead>Nama Perwadag</TableHead>
            <TableHead>Matriks</TableHead>
            <TableHead className="w-[80px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Tidak ada data laporan hasil evaluasi
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{formatIndonesianDate(item.tanggal)}</TableCell>
                <TableCell>{formatIndonesianDateRange(item.tanggalMulaiEvaluasi, item.tanggalAkhirEvaluasi)}</TableCell>
                <TableCell>{item.perwadagName}</TableCell>
                <TableCell>
                  <Badge variant={getMatriksBadgeVariant(item.matriks)}>
                    {item.matriks}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ActionDropdown
                    onView={() => onView?.(item)}
                    onEdit={canEdit?.(item) ? () => onEdit?.(item) : undefined}
                    showView={true}
                    showEdit={canEdit?.(item) && !!onEdit}
                    showDelete={false}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LaporanHasilEvaluasiTable;