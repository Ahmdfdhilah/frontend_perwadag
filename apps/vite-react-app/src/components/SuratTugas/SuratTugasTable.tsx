import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { Skeleton } from '@workspace/ui/components/skeleton';
import ActionDropdown from '@/components/common/ActionDropdown';
import FileViewLink from '@/components/common/FileViewLink';
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
  isDashboard?: boolean;
  currentPage?: number;
  itemsPerPage?: number;
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
  isDashboard = false,
  currentPage = 1,
  itemsPerPage = 10,
}) => {

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama Perwadag</TableHead>
              <TableHead>Tanggal Pelaksanaan Evaluasi</TableHead>
              <TableHead>No. Surat Tugas</TableHead>
              <TableHead>File Surat Tugas</TableHead>
              {!isDashboard && <TableHead className="w-[80px]">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  {!isDashboard && <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isDashboard ? 5 : 6} className="text-center py-8 text-muted-foreground">
                  Tidak ada data surat tugas
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell>{item.nama_perwadag}</TableCell>
                  <TableCell>{formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai)}</TableCell>
                  <TableCell>{item.no_surat}</TableCell>
                  <TableCell>
                    <FileViewLink
                      hasFile={true}
                      fileUrls={{
                        view_url: item.file_surat_tugas_url,
                        file_url: item.file_surat_tugas_url
                      }}
                      fileName="Surat Tugas"
                      linkText="Lihat File"
                    />
                  </TableCell>
                  {!isDashboard && (
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
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SuratTugasTable;