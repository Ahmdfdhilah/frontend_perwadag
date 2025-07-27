import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { FormatKuisionerResponse } from '@/services/formatKuisioner/types';
import ActionDropdown from '@/components/common/ActionDropdown';
import FileViewLink from '@/components/common/FileViewLink';

interface FormatKuisionerCardsProps {
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

export const FormatKuisionerCards: React.FC<FormatKuisionerCardsProps> = ({
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
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-8 w-24" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                <div>
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-8 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-32 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16 mt-1" />
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
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Tidak ada template format kuisioner yang ditemukan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((item, index) => (
        <Card key={item.id} className="w-full gap-0">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold">
                {item.nama_template}
              </CardTitle>
              <ActionDropdown
                onView={() => onView?.(item)}
                onEdit={() => onEdit?.(item)}
                onActivate={!item.is_active ? () => onActivate?.(item) : undefined}
                onDelete={() => onDelete?.(item)}
                showView={true}
                showEdit={true}
                showActivate={!item.is_active}
                showDelete={true}
                isActivating={activatingTemplate?.id === item.id}
                deleteDisabled={item.is_active}
                deleteTooltip={item.is_active ? "Tidak dapat menghapus template aktif" : undefined}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">No:</span>
                <span className="ml-2">{(currentPage - 1) * itemsPerPage + index + 1}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Deskripsi:</span>
                <span className="ml-2">{item.deskripsi || '-'}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Tahun:</span>
                <span className="ml-2">{item.tahun}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Dokumen:</span>
                <span className="ml-2">
                  {renderDocumentLink(item)}
                </span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Status:</span>
                <span className="ml-2">
                  {getStatusSpan(item)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};