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
import { SuratPemberitahuan } from '@/mocks/suratPemberitahuan';
import { formatIndonesianDate, formatIndonesianDateRange } from '@/utils/timeFormat';

interface SuratPemberitahuanTableProps {
  data: SuratPemberitahuan[];
  onView?: (item: SuratPemberitahuan) => void;
  onEdit?: (item: SuratPemberitahuan) => void;
  canEdit?: (item: SuratPemberitahuan) => boolean;
}

const SuratPemberitahuanTable: React.FC<SuratPemberitahuanTableProps> = ({
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
            <TableHead>Tanggal Surat Pemberitahuan</TableHead>
            <TableHead>Tanggal Evaluasi</TableHead>
            <TableHead className="w-[80px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Tidak ada data surat pemberitahuan
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item.perwadagName}</TableCell>
                <TableCell>{formatIndonesianDate(item.tanggalSuratPemberitahuan)}</TableCell>
                <TableCell>{formatIndonesianDateRange(item.tanggalMulaiEvaluasi, item.tanggalAkhirEvaluasi)}</TableCell>
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

export default SuratPemberitahuanTable;