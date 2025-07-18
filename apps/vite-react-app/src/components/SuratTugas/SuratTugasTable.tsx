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
  canEdit?: (item: SuratTugasResponse) => boolean;
  canDelete?: (item: SuratTugasResponse) => boolean;
  isPerwadag?: boolean;
}

const SuratTugasTable: React.FC<SuratTugasTableProps> = ({
  data,
  loading = false,
  onView,
  onEdit,
  onDelete,
  canEdit = () => false,
  canDelete = () => false,
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
            <TableHead className="w-[80px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                Loading surat tugas...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
                <TableCell>
                  <ActionDropdown
                    onView={() => onView?.(item)}
                    onEdit={canEdit(item) && onEdit ? () => onEdit(item) : undefined}
                    onDelete={canDelete(item) && onDelete ? () => onDelete(item) : undefined}
                    showView={true}
                    showEdit={!isPerwadag && !!onEdit && canEdit(item)}
                    showDelete={!isPerwadag && !!onDelete && canDelete(item)}
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