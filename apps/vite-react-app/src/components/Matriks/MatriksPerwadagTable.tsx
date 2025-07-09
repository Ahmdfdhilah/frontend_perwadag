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

interface MatriksPerwadagTableProps {
  data: Matriks[];
}

const MatriksPerwadagTable: React.FC<MatriksPerwadagTableProps> = ({
  data,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Nama Perwadag</TableHead>
            <TableHead>Temuan</TableHead>
            <TableHead>Rekomendasi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                Tidak ada data matriks
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{formatDate(item.tanggal)}</TableCell>
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