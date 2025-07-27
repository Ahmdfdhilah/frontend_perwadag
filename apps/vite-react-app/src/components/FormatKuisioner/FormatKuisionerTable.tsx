import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { Button } from '@workspace/ui/components/button';
import { Skeleton } from '@workspace/ui/components/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { FormatKuisionerResponse } from '@/services/formatKuisioner/types';
import FileViewLink from '@/components/common/FileViewLink';
import {
  Eye,
  Edit,
  Power,
  Trash2,
  Loader2,
} from 'lucide-react';

interface FormatKuisionerTableProps {
  data: FormatKuisionerResponse[];
  loading?: boolean;
  onView?: (item: FormatKuisionerResponse) => void;
  onEdit?: (item: FormatKuisionerResponse) => void;
  onActivate?: (item: FormatKuisionerResponse) => void;
  onDelete?: (item: FormatKuisionerResponse) => void;
  activatingTemplate?: FormatKuisionerResponse | null;
  currentPage?: number;
  itemsPerPage?: number;
}

export const FormatKuisionerTable: React.FC<FormatKuisionerTableProps> = ({
  data,
  loading = false,
  onView,
  onEdit,
  onActivate,
  onDelete,
  activatingTemplate,
  currentPage = 1,
  itemsPerPage = 10,
}) => {
  const getStatusSpan = (template: FormatKuisionerResponse) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        template.is_active
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {template.is_active ? 'Aktif' : 'Tidak Aktif'}
      </span>
    );
  };

  const renderDocumentLink = (template: FormatKuisionerResponse) => {
    return (
      <FileViewLink
        hasFile={template.has_file}
        fileUrls={template.file_urls}
        fileName={template.file_metadata?.original_filename}
        linkText="Lihat Template"
      />
    );
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">No.</TableHead>
              <TableHead>Nama Template</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Tahun</TableHead>
              <TableHead>Dokumen</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-[30px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-8 w-[40px]" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <div className="text-muted-foreground">
          <p className="text-lg font-medium">Belum ada template format kuisioner</p>
          <p className="text-sm">Buat template format kuisioner pertama untuk memulai.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">No.</TableHead>
            <TableHead>Nama Template</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Tahun</TableHead>
            <TableHead>Dokumen</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell className="text-center">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
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
                {getStatusSpan(item)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Buka menu</span>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView?.(item)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Lihat
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(item)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onActivate?.(item)}
                      disabled={item.is_active || activatingTemplate?.id === item.id}
                    >
                      {activatingTemplate?.id === item.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Power className="mr-2 h-4 w-4" />
                      )}
                      {item.is_active ? 'Sudah Aktif' : 'Aktifkan'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete?.(item)}
                      disabled={item.is_active}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {item.is_active ? 'Tidak Dapat Dihapus' : 'Hapus'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};