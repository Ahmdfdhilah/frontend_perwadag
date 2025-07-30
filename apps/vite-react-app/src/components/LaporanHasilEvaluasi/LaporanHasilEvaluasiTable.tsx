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
import { LaporanHasilResponse } from '@/services/laporanHasil/types';
import { formatIndonesianDateRange, formatIndonesianDate } from '@/utils/timeFormat';

interface LaporanHasilEvaluasiTableProps {
  data: LaporanHasilResponse[];
  loading?: boolean;
  onView?: (item: LaporanHasilResponse) => void;
  onEdit?: (item: LaporanHasilResponse) => void;
  onComposeEmail?: (item: LaporanHasilResponse) => void;
  canEdit?: (item: LaporanHasilResponse) => boolean;
  canComposeEmail?: boolean;
  currentPage?: number;
  itemsPerPage?: number;
}

const LaporanHasilEvaluasiTable: React.FC<LaporanHasilEvaluasiTableProps> = ({
  data,
  loading = false,
  onView,
  onEdit,
  onComposeEmail,
  canEdit,
  canComposeEmail = true,
  currentPage = 1,
  itemsPerPage = 10,
}) => {

  const getStatusBadge = (laporan: LaporanHasilResponse) => {
    const isCompleted = laporan.is_completed;
    return (
      <span
  className={`px-2 py-1 rounded-full text-xs font-medium
    ${
      isCompleted
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
    }`}
>
  {isCompleted ? 'Lengkap' : 'Belum Lengkap'}
</span>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama Perwadag</TableHead>
            <TableHead>Tanggal Evaluasi</TableHead>
            <TableHead>Nomor Laporan</TableHead>
            <TableHead>Tanggal Laporan</TableHead>
            <TableHead>Laporan Hasil Evaluasi</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Aksi</TableHead>
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
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                Tidak ada data laporan hasil evaluasi yang ditemukan.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{item.nama_perwadag}</TableCell>
                <TableCell>{formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai)}</TableCell>
                <TableCell>{item.nomor_laporan || '-'}</TableCell>
                <TableCell>{item.tanggal_laporan ? formatIndonesianDate(item.tanggal_laporan) : '-'}</TableCell>
                <TableCell>
                  <FileViewLink
                    hasFile={item.has_file}
                    fileUrls={item.file_urls}
                    fileName={item.file_metadata?.original_filename}
                    linkText="Lihat Dokumen"
                  />
                </TableCell>
                <TableCell>
                  {getStatusBadge(item)}
                </TableCell>
                <TableCell>
                  <ActionDropdown
                    onView={() => onView?.(item)}
                    onEdit={canEdit?.(item) ? () => onEdit?.(item) : undefined}
                    onComposeEmail={() => onComposeEmail?.(item)}
                    showView={true}
                    showEdit={canEdit?.(item) && !!onEdit}
                    showDelete={false}
                    showComposeEmail={canComposeEmail && !!onComposeEmail}
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

export default LaporanHasilEvaluasiTable;