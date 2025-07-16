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
import { FormatKuisionerResponse } from '@/services/formatKuisioner/types';

interface QuestionnaireTableProps {
  data: FormatKuisionerResponse[];
  loading?: boolean;
  onView?: (item: FormatKuisionerResponse) => void;
  onEdit?: (item: FormatKuisionerResponse) => void;
  onDelete?: (item: FormatKuisionerResponse) => void;
  canEdit?: (item?: FormatKuisionerResponse) => boolean;
  canDelete?: (item?: FormatKuisionerResponse) => boolean;
}

const QuestionnaireTable: React.FC<QuestionnaireTableProps> = ({
  data,
  loading = false,
  onView,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}) => {
  const getStatusBadge = (template: FormatKuisionerResponse) => {
    const hasFile = template.has_file;
    const isCurrentYear = template.is_current_year;
    
    if (hasFile && isCurrentYear) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Tersedia
        </span>
      );
    } else if (hasFile && !isCurrentYear) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Archived
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Belum Tersedia
        </span>
      );
    }
  };

  const renderDocumentLink = (template: FormatKuisionerResponse) => {
    if (template.has_file && template.file_urls?.view_url) {
      return (
        <a
          href={template.file_urls.view_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Lihat Template
        </a>
      );
    }
    return <span className="text-muted-foreground">-</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Loading template...
      </div>
    );
  }
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama Template</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Tahun</TableHead>
            <TableHead>Dokumen</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Tidak ada template kuesioner yang ditemukan.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{item.nama_template}</TableCell>
                <TableCell className="max-w-md">
                  <div className="truncate" title={item.deskripsi}>
                    {item.deskripsi || '-'}
                  </div>
                </TableCell>
                <TableCell>{item.tahun}</TableCell>
                <TableCell>
                  {renderDocumentLink(item)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(item)}
                </TableCell>
                <TableCell>
                  <ActionDropdown
                    onView={() => onView?.(item)}
                    onEdit={canEdit?.() ? () => onEdit?.(item) : undefined}
                    onDelete={canDelete?.() ? () => onDelete?.(item) : undefined}
                    showView={true}
                    showEdit={canEdit?.() && !!onEdit}
                    showDelete={canDelete?.() && !!onDelete}
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

export default QuestionnaireTable;