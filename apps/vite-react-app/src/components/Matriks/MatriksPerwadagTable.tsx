import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { Matriks } from '@/mocks/matriks';
import { formatIndonesianDateRange, formatIndonesianDate } from '@/utils/timeFormat';

interface MatriksPerwadagTableProps {
  data: Matriks[];
}

const MatriksPerwadagTable: React.FC<MatriksPerwadagTableProps> = ({
  data,
}) => {

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Tanggal Matriks</TableHead>
            <TableHead>Tanggal Evaluasi</TableHead>
            <TableHead>Nama Perwadag</TableHead>
            <TableHead>Temuan</TableHead>
            <TableHead>Rekomendasi</TableHead>
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
                <TableCell className="max-w-xs">
                  <div className="truncate" title={item.temuan}>
                    {item.temuan}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate" title={item.rekomendasi}>
                    {item.rekomendasi}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MatriksPerwadagTable;