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
import { MatriksResponse } from '@/services/matriks/types';
import { formatIndonesianDateRange } from '@/utils/timeFormat';

interface MatriksTableProps {
  data: MatriksResponse[];
  loading?: boolean;
  onEdit?: (item: MatriksResponse) => void;
  onView?: (item: MatriksResponse) => void;
  onExport?: (item: MatriksResponse) => void;
  canEdit?: (item: MatriksResponse) => boolean;
  canView?: (item: MatriksResponse) => boolean;
  userRole: 'admin' | 'inspektorat' | 'perwadag';
}

const MatriksTable: React.FC<MatriksTableProps> = ({
  data,
  loading = false,
  onEdit,
  onView,
  onExport,
  canEdit,
  canView,
  userRole,
}) => {

  const getStatusBadge = (matriks: MatriksResponse) => {
    const isCompleted = matriks.is_completed;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${isCompleted
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800'
        }`}>
        {isCompleted ? 'Lengkap' : 'Belum Lengkap'}
      </span>
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

  const renderAdminInspektoratColumns = (showActions = false) => {
    return (
      <>
        <TableHead>No</TableHead>
        <TableHead>Nama Perwadag</TableHead>
        <TableHead>Tanggal Evaluasi</TableHead>
        <TableHead>Dokumen</TableHead>
        <TableHead>Status</TableHead>
        {showActions && <TableHead className="w-[80px]">Aksi</TableHead>}
      </>
    );
  };

  const renderPerwadagColumns = (showActions = false) => {
    return (
      <>
        <TableHead>No</TableHead>
        <TableHead>Tanggal Evaluasi</TableHead>
        <TableHead>Dokumen</TableHead>
        <TableHead>Status</TableHead>
        {showActions && <TableHead className="w-[80px]">Aksi</TableHead>}
      </>
    );
  };

  if (loading) {
    const showActionsColumn = !!(onEdit || onView || onExport);

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {userRole === 'perwadag' ? renderPerwadagColumns(showActionsColumn) : renderAdminInspektoratColumns(showActionsColumn)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                {userRole !== 'perwadag' && <TableCell><Skeleton className="h-4 w-48" /></TableCell>}
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                {showActionsColumn && <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  const renderAdminInspektoratRow = (item: MatriksResponse, index: number) => {
    // Check if any item can be edited, viewed, or exported to determine if we need the Actions column
    const hasActionableItems = data.some(item => canEdit?.(item) || canView?.(item) || onExport);
    
    return (
      <TableRow key={item.id}>
        <TableCell className="font-medium">{index + 1}</TableCell>
        <TableCell>{item.nama_perwadag}</TableCell>
        <TableCell>{formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai)}</TableCell>
        <TableCell>{renderDocumentLink(item)}</TableCell>
        <TableCell>
          {getStatusBadge(item)}
        </TableCell>
        {hasActionableItems && (
          <TableCell>
            {(canEdit?.(item) || canView?.(item) || onExport) ? (
              <ActionDropdown
                onEdit={() => onEdit?.(item)}
                onView={() => onView?.(item)}
                onExport={() => onExport?.(item)}
                showView={!!onView && !!canView?.(item)}
                showEdit={!!onEdit && !!canEdit?.(item)}
                showExport={!!onExport}
                showDelete={false}
              />
            ) : (
              <span className="text-muted-foreground text-sm">-</span>
            )}
          </TableCell>
        )}
      </TableRow>
    );
  };

  const renderPerwadagRow = (item: MatriksResponse, index: number) => {
    // Check if any item can be edited, viewed, or exported to determine if we need the Actions column
    const hasActionableItems = data.some(item => canEdit?.(item) || canView?.(item) || onExport);
    
    return (
      <TableRow key={item.id}>
        <TableCell className="font-medium">{index + 1}</TableCell>
        <TableCell>{formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai)}</TableCell>
        <TableCell>{renderDocumentLink(item)}</TableCell>
        <TableCell>
          {getStatusBadge(item)}
        </TableCell>
        {hasActionableItems && (
          <TableCell>
            {(canEdit?.(item) || canView?.(item) || onExport) ? (
              <ActionDropdown
                onEdit={() => onEdit?.(item)}
                onView={() => onView?.(item)}
                onExport={() => onExport?.(item)}
                showView={!!onView && !!canView?.(item)}
                showEdit={!!onEdit && !!canEdit?.(item)}
                showExport={!!onExport}
                showDelete={false}
              />
            ) : (
              <span className="text-muted-foreground text-sm">-</span>
            )}
          </TableCell>
        )}
      </TableRow>
    );
  };

  const hasActionableItems = data.some(item => canEdit?.(item) || canView?.(item) || onExport);
  const columnsCount = userRole === 'perwadag' 
    ? (hasActionableItems ? 5 : 4) 
    : (hasActionableItems ? 6 : 5);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {userRole === 'perwadag' ? renderPerwadagColumns(hasActionableItems) : renderAdminInspektoratColumns(hasActionableItems)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columnsCount} className="text-center py-8 text-muted-foreground">
                Tidak ada data matriks yang ditemukan.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              userRole === 'perwadag'
                ? renderPerwadagRow(item, index)
                : renderAdminInspektoratRow(item, index)
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MatriksTable;