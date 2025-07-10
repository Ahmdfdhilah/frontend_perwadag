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
import { formatIndonesianDateRange } from '@/utils/timeFormat';

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
            <TableHead>Nama Perwadag</TableHead>
            <TableHead>Tanggal Evaluasi</TableHead>
            <TableHead>Dokumen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                Tidak ada data matriks
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item.perwadagName}</TableCell>
                <TableCell>{formatIndonesianDateRange(item.tanggalMulaiEvaluasi, item.tanggalAkhirEvaluasi)}</TableCell>
                <TableCell>
                  {item.uploadFile ? (
                    <a 
                      href={item.uploadFileUrl || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Lihat Dokumen
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Tidak ada dokumen</span>
                  )}
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