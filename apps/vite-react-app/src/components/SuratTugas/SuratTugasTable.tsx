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
import { SuratTugasResponse } from '@/services/suratTugas/types';
import { formatIndonesianDateRange } from '@/utils/timeFormat';

interface SuratTugasTableProps {
  data: SuratTugasResponse[];
  loading?: boolean;
  onView?: (item: SuratTugasResponse) => void;
  onEdit?: (item: SuratTugasResponse) => void;
  onDelete?: (item: SuratTugasResponse) => void;
  isPerwadag?: boolean;
}

const SuratTugasTable: React.FC<SuratTugasTableProps> = ({
  data,
  loading = false,
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
            <TableHead>Nama Perwadag</TableHead>
            <TableHead>Tanggal Pelaksanaan Evaluasi</TableHead>
            <TableHead>No Surat</TableHead>
            <TableHead>Pengendali Mutu</TableHead>
            <TableHead>Pengendali Teknis</TableHead>
            <TableHead>Ketua</TableHead>
            <TableHead className="w-[80px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                Loading surat tugas...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                Tidak ada data surat tugas
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item.nama_perwadag}</TableCell>
                <TableCell>{formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai)}</TableCell>
                <TableCell>{item.no_surat}</TableCell>
                <TableCell>{item.nama_pengedali_mutu}</TableCell>
                <TableCell>{item.nama_pengendali_teknis}</TableCell>
                <TableCell>{item.nama_ketua_tim}</TableCell>
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