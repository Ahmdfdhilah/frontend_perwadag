import React from 'react';
import { Edit, Eye, Trash2, Mail, Download, Power, Loader2, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { Button } from '@workspace/ui/components/button';

interface ActionDropdownProps {
  onView?: () => void;
  onEdit?: () => void;
  onActivate?: () => void;
  onDelete?: () => void;
  onComposeEmail?: () => void;
  onExport?: () => void;
  onDownloadPdf?: () => void;
  showView?: boolean;
  showEdit?: boolean;
  showActivate?: boolean;
  showDelete?: boolean;
  showComposeEmail?: boolean;
  showExport?: boolean;
  showDownloadPdf?: boolean;
  isActivating?: boolean;
  deleteDisabled?: boolean;
  deleteTooltip?: string;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  onView,
  onEdit,
  onActivate,
  onDelete,
  onComposeEmail,
  onExport,
  onDownloadPdf,
  showView = true,
  showEdit = true,
  showActivate = false,
  showDelete = true,
  showComposeEmail = false,
  showExport = false,
  showDownloadPdf = false,
  isActivating = false,
  deleteDisabled = false,
  deleteTooltip,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <Edit className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {showView && onView && (
          <DropdownMenuItem onClick={onView}>
            <Eye className="mr-2 h-4 w-4" />
            Lihat
          </DropdownMenuItem>
        )}
        {showEdit && onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        {showActivate && onActivate && (
          <DropdownMenuItem 
            onClick={onActivate}
            disabled={isActivating}
          >
            {isActivating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Power className="mr-2 h-4 w-4" />
            )}
            {isActivating ? 'Mengaktifkan...' : 'Aktifkan'}
          </DropdownMenuItem>
        )}
        {showComposeEmail && onComposeEmail && (
          <DropdownMenuItem onClick={onComposeEmail}>
            <Mail className="mr-2 h-4 w-4" />
            Kirim Email
          </DropdownMenuItem>
        )}
        {showExport && onExport && (
          <DropdownMenuItem onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </DropdownMenuItem>
        )}
        {showDownloadPdf && onDownloadPdf && (
          <DropdownMenuItem onClick={onDownloadPdf}>
            <FileText className="mr-2 h-4 w-4" />
            Download PDF
          </DropdownMenuItem>
        )}
        {showDelete && onDelete && (
          <DropdownMenuItem 
            onClick={onDelete} 
            className="text-red-600"
            disabled={deleteDisabled}
            title={deleteTooltip}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleteDisabled ? 'Tidak Dapat Dihapus' : 'Hapus'}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionDropdown;