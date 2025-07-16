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
import FileViewLink from '@/components/common/FileViewLink';
import { MatriksResponse } from '@/services/matriks/types';
import { formatIndonesianDateRange } from '@/utils/timeFormat';

interface MatriksTableProps {
  data: MatriksResponse[];
  loading?: boolean;
  onEdit?: (item: MatriksResponse) => void;
  canEdit?: (item: MatriksResponse) => boolean;
  userRole: 'admin' | 'inspektorat' | 'perwadag';
}

const MatriksTable: React.FC<MatriksTableProps> = ({
  data,
  loading = false,
  onEdit,
  canEdit,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Loading matriks...
      </div>
    );
  }

  const renderAdminInspektoratColumns = () => (
    <>
      <TableHead>No</TableHead>
      <TableHead>Nama Perwadag</TableHead>
      <TableHead>Tanggal Evaluasi</TableHead>
      <TableHead>Dokumen</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="w-[80px]">Aksi</TableHead>
    </>
  );

  const renderPerwadagColumns = () => (
    <>
      <TableHead>No</TableHead>
      <TableHead>Tanggal Evaluasi</TableHead>
      <TableHead>Dokumen</TableHead>
      <TableHead>Status</TableHead>
    </>
  );

  const renderAdminInspektoratRow = (item: MatriksResponse, index: number) => (
    <TableRow key={item.id}>
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell>{item.nama_perwadag}</TableCell>
      <TableCell>{formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai)}</TableCell>
      <TableCell>{renderDocumentLink(item)}</TableCell>
      <TableCell>
        {getStatusBadge(item)}
      </TableCell>
      <TableCell>
        <ActionDropdown
          onEdit={canEdit?.(item) ? () => onEdit?.(item) : undefined}
          showView={false}
          showEdit={canEdit?.(item) && !!onEdit}
          showDelete={false}
        />
      </TableCell>
    </TableRow>
  );

  const renderPerwadagRow = (item: MatriksResponse, index: number) => (
    <TableRow key={item.id}>
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell>{formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai)}</TableCell>
      <TableCell>{renderDocumentLink(item)}</TableCell>
      <TableCell>
        {getStatusBadge(item)}
      </TableCell>
    </TableRow>
  );

  const columnsCount = userRole === 'perwadag' ? 4 : 6;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {userRole === 'perwadag' ? renderPerwadagColumns() : renderAdminInspektoratColumns()}
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