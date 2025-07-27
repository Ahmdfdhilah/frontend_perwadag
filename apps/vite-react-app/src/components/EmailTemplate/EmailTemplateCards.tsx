import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { EmailTemplate } from '@/services/emailTemplate/types';
import ActionDropdown from '@/components/common/ActionDropdown';

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
  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        isActive
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? 'Aktif' : 'Tidak Aktif'}
      </span>
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
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-40 mt-1" />
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
        Tidak ada template email ditemukan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((template, index) => (
        <Card key={template.id} className="w-full gap-0">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold">
                {template.name}
              </CardTitle>
              <ActionDropdown
                onView={() => onView(template)}
                onEdit={() => onEdit(template)}
                onActivate={!template.is_active ? () => onActivate(template) : undefined}
                onDelete={() => onDelete(template)}
                showView={true}
                showEdit={true}
                showActivate={!template.is_active}
                showDelete={true}
                isActivating={activatingTemplate?.id === template.id}
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
                <span className="font-medium text-muted-foreground">Subject Template:</span>
                <span className="ml-2">{template.subject_template}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Body Template:</span>
                <span className="ml-2 font-mono text-xs">{template.body_template.substring(0, 80)}...</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Status:</span>
                <span className="ml-2">
                  {getStatusBadge(template.is_active)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};