import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import ActionDropdown from '@/components/common/ActionDropdown';
import { QuestionnaireTemplate, getQuestionnaireTemplateStatus } from '@/mocks/questionnaireTemplate';

interface QuestionnaireTableProps {
  data: QuestionnaireTemplate[];
  onView?: (item: QuestionnaireTemplate) => void;
  onEdit?: (item: QuestionnaireTemplate) => void;
  onDelete?: (item: QuestionnaireTemplate) => void;
  canEdit?: (item: QuestionnaireTemplate) => boolean;
  canDelete?: (item: QuestionnaireTemplate) => boolean;
}

const QuestionnaireTable: React.FC<QuestionnaireTableProps> = ({
  data,
  onView,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama Template</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Tahun</TableHead>
            <TableHead>Dokumen</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Tidak ada template kuesioner
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.no}</TableCell>
                <TableCell className="font-medium">{item.nama}</TableCell>
                <TableCell className="max-w-md">
                  <div className="truncate" title={item.deskripsi}>
                    {item.deskripsi}
                  </div>
                </TableCell>
                <TableCell>{item.tahun}</TableCell>
                <TableCell>
                  {item.dokumen ? (
                    <button
                      onClick={() => {
                        console.log('Lihat template:', item.dokumen);
                        // Implement view/download logic here
                      }}
                      className="text-blue-600 hover:text-blue-800 underline text-left"
                    >
                      Lihat Template
                    </button>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    getQuestionnaireTemplateStatus(item) === 'Tersedia'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {getQuestionnaireTemplateStatus(item)}
                  </span>
                </TableCell>
                <TableCell>
                  <ActionDropdown
                    onView={() => onView?.(item)}
                    onEdit={canEdit?.(item) ? () => onEdit?.(item) : undefined}
                    onDelete={canDelete?.(item) ? () => onDelete?.(item) : undefined}
                    showView={true}
                    showEdit={canEdit?.(item) && !!onEdit}
                    showDelete={canDelete?.(item) && !!onDelete}
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

export default QuestionnaireTable;