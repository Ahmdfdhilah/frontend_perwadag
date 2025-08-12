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
import { MatriksResponse, MatriksStatus } from '@/services/matriks/types';
import { formatIndonesianDateRange } from '@/utils/timeFormat';
import { Badge } from '@workspace/ui/components/badge';

interface MatriksTableProps {
  data: MatriksResponse[];
  loading?: boolean;
  onEdit?: (item: MatriksResponse) => void;
  onView?: (item: MatriksResponse) => void;
  onExport?: (item: MatriksResponse) => void;
  canEdit?: (item: MatriksResponse) => boolean;
  userRole: 'admin' | 'inspektorat' | 'perwadag';
  currentPage?: number;
  itemsPerPage?: number;
}

const MatriksTable: React.FC<MatriksTableProps> = ({
  data,
  loading = false,
  onEdit,
  onView,
  onExport,
  canEdit,
  userRole,
  currentPage = 1,
  itemsPerPage = 10,
}) => {

  // Get status badge variant
  const getStatusVariant = (status?: MatriksStatus) => {
    switch (status) {
      case 'DRAFTING': return 'secondary';
      case 'CHECKING': return 'outline';
      case 'VALIDATING': return 'default';
      case 'FINISHED': return 'default';
      default: return 'secondary';
    }
  };

  // Get status label
  const getStatusLabel = (status?: MatriksStatus) => {
    switch (status) {
      case 'DRAFTING': return 'Draft';
      case 'CHECKING': return 'Review Ketua Tim';
      case 'VALIDATING': return 'Review Pengendali';
      case 'FINISHED': return 'Selesai';
      default: return 'Draft';
    }
  };

  const getStatusBadge = (matriks: MatriksResponse) => {
    return (
      <Badge variant={getStatusVariant(matriks.status)}>
        {getStatusLabel(matriks.status)}
      </Badge>
    );
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




  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama Perwadag</TableHead>
            <TableHead>Tanggal Evaluasi</TableHead>
            <TableHead>Dokumen</TableHead>
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
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={userRole === 'perwadag' ? 5 : 6} className="text-center py-8 text-muted-foreground">
                Tidak ada data matriks yang ditemukan.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{item.nama_perwadag}</TableCell>
                <TableCell>{formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai)}</TableCell>
                <TableCell>{renderDocumentLink(item)}</TableCell>
                <TableCell>
                  {getStatusBadge(item)}
                </TableCell>
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

export default MatriksTable;