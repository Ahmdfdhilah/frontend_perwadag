import React from 'react';
import { Card, CardContent, CardHeader } from '@workspace/ui/components/card';
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
  Loader2,
  Calendar,
} from 'lucide-react';

interface EmailTemplateCardsProps {
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

export const EmailTemplateCards: React.FC<EmailTemplateCardsProps> = ({
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
  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <Skeleton className="h-6 w-[80px]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-8 w-[40px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="text-center p-8">
        <div className="text-muted-foreground">
          <p className="text-lg font-medium">Belum ada template email</p>
          <p className="text-sm">Buat template email pertama untuk memulai.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
      {data.map((template, index) => (
        <Card key={template.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </span>
                  <h3 className="font-medium text-lg">{template.name}</h3>
                </div>
              </div>
              <Badge
                variant={template.is_active ? "default" : "secondary"}
                className={template.is_active ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {template.is_active ? 'Aktif' : 'Tidak Aktif'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Subject Template:
                </p>
                <p className="text-sm bg-muted p-2 rounded border">
                  {truncateText(template.subject_template)}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Body Template:
                </p>
                <p className="text-sm bg-muted p-2 rounded border font-mono">
                  {truncateText(template.body_template, 120)}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(template.created_at).toLocaleDateString('id-ID')}
                  </span>

                </div>

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
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};