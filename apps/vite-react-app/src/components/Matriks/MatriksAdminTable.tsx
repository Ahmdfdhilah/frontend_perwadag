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
import { Matriks } from '@/mocks/matriks';
import { formatIndonesianDateRange, formatIndonesianDate } from '@/utils/timeFormat';

interface MatriksAdminTableProps {
  data: Matriks[];
  onView?: (item: Matriks) => void;
  onEdit?: (item: Matriks) => void;
  canEdit?: (item: Matriks) => boolean;
}

const MatriksAdminTable: React.FC<MatriksAdminTableProps> = ({
  data,
  onView,
  onEdit,
  canEdit,
}) => {

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Diisi':
        return 'default';
      case 'Belum Diisi':
        return 'outline';
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
            <TableHead>Tanggal Matriks</TableHead>
            <TableHead>Tanggal Evaluasi</TableHead>
            <TableHead>Nama Perwadag</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Tidak ada data matriks
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
                  <Badge variant={getStatusBadgeVariant(item.status)}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ActionDropdown
                    onView={onView ? () => onView(item) : undefined}
                    onEdit={canEdit?.(item) ? () => onEdit?.(item) : undefined}
                    showView={!!onView}
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

export default MatriksAdminTable;