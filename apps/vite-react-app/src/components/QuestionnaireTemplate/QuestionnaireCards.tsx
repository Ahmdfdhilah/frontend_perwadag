import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { QuestionnaireTemplate } from '@/mocks/questionnaireTemplate';
import ActionDropdown from '@/components/common/ActionDropdown';

interface QuestionnaireCardsProps {
  data: QuestionnaireTemplate[];
  onView?: (item: QuestionnaireTemplate) => void;
  onEdit?: (item: QuestionnaireTemplate) => void;
  onDelete?: (item: QuestionnaireTemplate) => void;
  canEdit?: (item: QuestionnaireTemplate) => boolean;
  canDelete?: (item: QuestionnaireTemplate) => boolean;
}

const QuestionnaireCards: React.FC<QuestionnaireCardsProps> = ({
  data,
  onView,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Tidak ada template kuesioner yang ditemukan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((item) => (
        <Card key={item.id} className="w-full">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold">
                {item.nama}
              </CardTitle>
              <ActionDropdown
                onView={() => onView?.(item)}
                onEdit={canEdit?.(item) ? () => onEdit?.(item) : undefined}
                onDelete={canDelete?.(item) ? () => onDelete?.(item) : undefined}
                showView={true}
                showEdit={canEdit?.(item) && !!onEdit}
                showDelete={canDelete?.(item) && !!onDelete}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">No:</span>
                <span className="ml-2">{item.no}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Deskripsi:</span>
                <span className="ml-2">{item.deskripsi}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Tahun:</span>
                <span className="ml-2">{item.tahun}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Link Template:</span>
                {item.linkTemplate ? (
                  <a
                    href={item.linkTemplate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    Lihat Template
                  </a>
                ) : (
                  <span className="ml-2 text-muted-foreground">-</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuestionnaireCards;