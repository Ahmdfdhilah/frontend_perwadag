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
import { Badge } from '@workspace/ui/components/badge';
import { Skeleton } from '@workspace/ui/components/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { EmailTemplate } from '@/services/emailTemplate/types';
import {
  Eye,
  Edit,
  Power,
  Trash2,
  Loader2
} from 'lucide-react';

interface EmailTemplateTableProps {
  data: EmailTemplate[];
  loading: boolean;
  onView: (template: EmailTemplate) => void;
  onEdit: (template: EmailTemplate) => void;
  onActivate: (template: EmailTemplate) => void;
  onDelete: (template: EmailTemplate) => void;
  activatingTemplate?: EmailTemplate | null;
  currentPage?: number;
  itemsPerPage?: number;
}

export const EmailTemplateTable: React.FC<EmailTemplateTableProps> = ({
  data,
  loading,
  onView,
  onEdit,
  onActivate,
  onDelete,
  activatingTemplate,
  currentPage = 1,
  itemsPerPage = 10,
}) => {
  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">No.</TableHead>
              <TableHead>Nama Template</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-[30px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[300px]" /></TableCell>
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
          <p className="text-lg font-medium">Belum ada template email</p>
          <p className="text-sm">Buat template email pertama untuk memulai.</p>
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
            <TableHead>Subject Template</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((template, index) => (
            <TableRow key={template.id}>
              <TableCell className="text-center">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell className="font-medium">
                <div>
                  <p className="font-medium">{template.name}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-[300px]">
                  <p className="text-sm">
                    {truncateText(template.subject_template, 60)}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={template.is_active ? "default" : "secondary"}
                  className={template.is_active ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {template.is_active ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
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
                    <DropdownMenuItem onClick={() => onView(template)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Lihat
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(template)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onActivate(template)}
                      disabled={template.is_active || activatingTemplate?.id === template.id}
                    >
                      {activatingTemplate?.id === template.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Power className="mr-2 h-4 w-4" />
                      )}
                      {template.is_active ? 'Sudah Aktif' : 'Aktifkan'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(template)}
                      disabled={template.is_active}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {template.is_active ? 'Tidak Dapat Dihapus' : 'Hapus'}
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