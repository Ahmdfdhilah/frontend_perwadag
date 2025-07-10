import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import ActionDropdown from '@/components/common/ActionDropdown';
import { Matriks } from '@/mocks/matriks';
import { formatIndonesianDateRange } from '@/utils/timeFormat';

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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama Perwadag</TableHead>
            <TableHead>Tanggal Evaluasi</TableHead>
            <TableHead>Dokumen</TableHead>
            <TableHead className="w-[80px]">Aksi</TableHead>
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
                      {item.uploadFile}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Tidak ada dokumen</span>
                  )}
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