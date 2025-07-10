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
import { SuratTugas } from '@/mocks/suratTugas';
import { formatIndonesianDateRange } from '@/utils/timeFormat';

interface SuratTugasTableProps {
  data: SuratTugas[];
  onView?: (item: SuratTugas) => void;
  onEdit?: (item: SuratTugas) => void;
  onDelete?: (item: SuratTugas) => void;
  isPerwadag?: boolean;
}

const SuratTugasTable: React.FC<SuratTugasTableProps> = ({
  data,
  onView,
  onEdit,
  onDelete,
  isPerwadag = false,
}) => {

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Tanggal Pelaksanaan Evaluasi</TableHead>
            <TableHead>Nama Perwadag</TableHead>
            <TableHead>No Surat</TableHead>
            <TableHead>Pengendali Mutu</TableHead>
            <TableHead>Pengendali Teknis</TableHead>
            <TableHead>Ketua</TableHead>
            <TableHead className="w-[80px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                Tidak ada data surat tugas
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{formatIndonesianDateRange(item.tanggalMulaiEvaluasi, item.tanggalAkhirEvaluasi)}</TableCell>
                <TableCell>{item.perwadagName}</TableCell>
                <TableCell>{item.nomor}</TableCell>
                <TableCell>{item.pengendaliMutu}</TableCell>
                <TableCell>{item.pengendaliTeknis}</TableCell>
                <TableCell>{item.ketuaTim}</TableCell>
                <TableCell>
                  <ActionDropdown
                    onView={() => onView?.(item)}
                    onEdit={onEdit ? () => onEdit(item) : undefined}
                    onDelete={onDelete ? () => onDelete(item) : undefined}
                    showView={true}
                    showEdit={!isPerwadag && !!onEdit}
                    showDelete={!isPerwadag && !!onDelete}
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

export default SuratTugasTable;