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
import { MatriksResponse, TindakLanjutStatus } from '@/services/matriks/types';
import { formatIndonesianDateRange } from '@/utils/timeFormat';

interface TindakLanjutMatriksTableProps {
  data: MatriksResponse[];
  loading?: boolean;
  onEdit?: (item: MatriksResponse) => void;
  onView?: (item: MatriksResponse) => void;
  onExport?: (item: MatriksResponse) => void;
  canEdit?: (item: MatriksResponse) => boolean;
  currentPage?: number;
  itemsPerPage?: number;
}

const TindakLanjutMatriksTable: React.FC<TindakLanjutMatriksTableProps> = ({
  data,
  loading = false,
  onEdit,
  onView,
  onExport,
  canEdit,
  currentPage = 1,
  itemsPerPage = 10,
}) => {

  const getTindakLanjutStatusBadge = (status?: TindakLanjutStatus) => {
    switch (status) {
      case 'DRAFTING':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
            Draft TL
          </span>
        );
      case 'CHECKING':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            Review Ketua Tim
          </span>
        );
      case 'VALIDATING':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            Review Pengendali
          </span>
        );
      case 'FINISHED':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Selesai
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
            Belum Ada TL
          </span>
        );
    }
  };

  const renderDocumentLink = (matriks: MatriksResponse) => {
    return (
      <FileViewLink
        hasFile={matriks.has_file}
        fileUrls={matriks.file_urls}
        fileName={matriks.file_metadata?.original_filename}
        linkText="Lihat Dokumen"
      />
    );
  };

  // Get tindak lanjut progress
  const getTindakLanjutProgress = (matriks: MatriksResponse) => {
    if (!matriks.temuan_rekomendasi_summary?.data) return '0/0';
    
    const totalItems = matriks.temuan_rekomendasi_summary.data.length;
    const completedItems = matriks.temuan_rekomendasi_summary.data.filter(
      item => item.status_tindak_lanjut === 'FINISHED'
    ).length;
    
    return `${completedItems}/${totalItems}`;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama Perwadag</TableHead>
            <TableHead>Tanggal Evaluasi</TableHead>
            <TableHead>Progress TL</TableHead>
            <TableHead>Status TL</TableHead>
            <TableHead>Dokumen</TableHead>
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
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Tidak ada data tindak lanjut matriks yang ditemukan.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{item.nama_perwadag}</TableCell>
                <TableCell>{formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai)}</TableCell>
                <TableCell>
                  <span className="text-sm font-medium">
                    {getTindakLanjutProgress(item)}
                  </span>
                </TableCell>
                <TableCell>
                  {getTindakLanjutStatusBadge(item.temuan_rekomendasi_summary?.data?.[0]?.status_tindak_lanjut)}
                </TableCell>
                <TableCell>{renderDocumentLink(item)}</TableCell>
                <TableCell>
                  <ActionDropdown
                    onView={() => onView?.(item)}
                    onEdit={canEdit?.(item) ? () => onEdit?.(item) : undefined}
                    onExport={() => onExport?.(item)}
                    showView={true}
                    showEdit={canEdit?.(item) && !!onEdit}
                    showExport={!!onExport}
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

export default TindakLanjutMatriksTable;