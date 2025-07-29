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
import { SuratPemberitahuanResponse } from '@/services/suratPemberitahuan/types';
import { formatIndonesianDate, formatIndonesianDateRange } from '@/utils/timeFormat';

interface SuratPemberitahuanTableProps {
  data: SuratPemberitahuanResponse[];
  loading?: boolean;
  onView?: (item: SuratPemberitahuanResponse) => void;
  onEdit?: (item: SuratPemberitahuanResponse) => void;
  canEdit?: (item: SuratPemberitahuanResponse) => boolean;
  currentPage?: number;
  itemsPerPage?: number;
}

const SuratPemberitahuanTable: React.FC<SuratPemberitahuanTableProps> = ({
  data,
  loading = false,
  onView,
  onEdit,
  canEdit,
  currentPage = 1,
  itemsPerPage = 10,
}) => {

  const getStatusBadge = (suratPemberitahuan: SuratPemberitahuanResponse) => {
    const isCompleted = suratPemberitahuan.is_completed;
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
            <TableHead>Tanggal Surat Pemberitahuan</TableHead>
            <TableHead>Tanggal Evaluasi</TableHead>
            <TableHead>File Surat Pemberitahuan</TableHead>
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
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Tidak ada data surat pemberitahuan yang ditemukan.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{item.nama_perwadag}</TableCell>
                <TableCell>{item.tanggal_surat_pemberitahuan ? formatIndonesianDate(item.tanggal_surat_pemberitahuan) : '-'}</TableCell>
                <TableCell>{formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai)}</TableCell>
                <TableCell>
                  <FileViewLink
                    hasFile={item.has_file}
                    fileUrls={{
                      view_url: item.file_urls?.view_url,
                      file_url: item.file_urls?.file_url
                    }}
                    fileName="Surat Pemberitahuan"
                    linkText="Lihat File"
                  />
                </TableCell>
                <TableCell>
                  {getStatusBadge(item)}
                </TableCell>
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