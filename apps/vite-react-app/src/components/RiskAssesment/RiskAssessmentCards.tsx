import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { RiskAssessment } from '@/mocks/riskAssessment';
import ActionDropdown from '@/components/common/ActionDropdown';

interface RiskAssessmentCardsProps {
  data: RiskAssessment[];
  onView?: (item: RiskAssessment) => void;
  onEdit?: (item: RiskAssessment) => void;
  onDelete?: (item: RiskAssessment) => void;
}

const RiskAssessmentCards: React.FC<RiskAssessmentCardsProps> = ({
  data,
  onView,
  onEdit,
  onDelete,
}) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Tidak ada data yang ditemukan.
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
                {item.perwadagName}
              </CardTitle>
              <ActionDropdown
                onView={() => onView?.(item)}
                onEdit={() => onEdit?.(item)}
                onDelete={() => onDelete?.(item)}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">No:</span>
                <span className="ml-2">{index + 1}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Tahun:</span>
                <span className="ml-2">{item.year}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Skor:</span>
                <span className="ml-2">{item.score}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Total:</span>
                <span className="ml-2">{item.total}</span>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-muted-foreground">Profil Risiko:</span>
                <span className="ml-2">{item.riskProfile}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RiskAssessmentCards;