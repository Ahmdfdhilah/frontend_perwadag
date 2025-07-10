import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { QuestionnaireTemplate, getQuestionnaireTemplateStatus } from '@/mocks/questionnaireTemplate';
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
                <span className="font-medium text-muted-foreground">Dokumen:</span>
                {item.dokumen ? (
                  <button
                    onClick={() => {
                      console.log('Lihat template:', item.dokumen);
                      // Implement view/download logic here
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    Lihat Template
                  </button>
                ) : (
                  <span className="ml-2 text-muted-foreground">-</span>
                )}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  getQuestionnaireTemplateStatus(item) === 'Tersedia'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {getQuestionnaireTemplateStatus(item)}
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