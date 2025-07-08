import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { RiskAssessment } from '@/mocks/riskAssessment';
import ActionDropdown from '@/components/common/ActionDropdown';

interface RiskAssessmentTableProps {
  data: RiskAssessment[];
  onView?: (item: RiskAssessment) => void;
  onEdit?: (item: RiskAssessment) => void;
  onDelete?: (item: RiskAssessment) => void;
}

const RiskAssessmentTable: React.FC<RiskAssessmentTableProps> = ({
  data,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">No</TableHead>
            <TableHead>Tahun</TableHead>
            <TableHead>Nama Perwadag</TableHead>
            <TableHead>Skor</TableHead>
            <TableHead>Profil Risiko Auditan</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Tidak ada data yang ditemukan.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item.year}</TableCell>
                <TableCell>{item.perwadagName}</TableCell>
                <TableCell>{item.score}</TableCell>
                <TableCell>{item.riskProfile}</TableCell>
                <TableCell>{item.total}</TableCell>
                <TableCell className="text-right">
                  <ActionDropdown
                    onView={() => onView?.(item)}
                    onEdit={() => onEdit?.(item)}
                    onDelete={() => onDelete?.(item)}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RiskAssessmentTable;