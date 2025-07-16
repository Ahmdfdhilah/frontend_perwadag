import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { FormatKuisionerResponse } from '@/services/formatKuisioner/types';
import ActionDropdown from '@/components/common/ActionDropdown';
import FileViewLink from '@/components/common/FileViewLink';

interface QuestionnaireCardsProps {
  data: FormatKuisionerResponse[];
  loading?: boolean;
  onView?: (item: FormatKuisionerResponse) => void;
  onEdit?: (item: FormatKuisionerResponse) => void;
  onDelete?: (item: FormatKuisionerResponse) => void;
  canEdit?: (item?: FormatKuisionerResponse) => boolean;
  canDelete?: (item?: FormatKuisionerResponse) => boolean;
}

const QuestionnaireCards: React.FC<QuestionnaireCardsProps> = ({
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
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Loading template...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Tidak ada template kuesioner yang ditemukan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((item, index) => (
        <Card key={item.id} className="w-full">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold">
                {item.nama_template}
              </CardTitle>
              <ActionDropdown
                onView={() => onView?.(item)}
                onEdit={canEdit?.() ? () => onEdit?.(item) : undefined}
                onDelete={canDelete?.() ? () => onDelete?.(item) : undefined}
                showView={true}
                showEdit={canEdit?.() && !!onEdit}
                showDelete={canDelete?.() && !!onDelete}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">No:</span>
                <span className="ml-2">{index + 1}</span>
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
                  {getStatusBadge(item)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuestionnaireCards;