import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { PenilaianRisikoResponse } from '@/services/penilaianRisiko/types';
import ActionDropdown from '@/components/common/ActionDropdown';

interface RiskAssessmentTableProps {
  data: PenilaianRisikoResponse[];
  loading?: boolean;
  onView?: (item: PenilaianRisikoResponse) => void;
  onEdit?: (item: PenilaianRisikoResponse) => void;
  onDelete?: (item: PenilaianRisikoResponse) => void;
  canEdit?: (item: PenilaianRisikoResponse) => boolean;
  currentPage?: number;
  itemsPerPage?: number;
}

const RiskAssessmentTable: React.FC<RiskAssessmentTableProps> = ({
  data,
  loading = false,
  onView,
  onEdit,
  onDelete,
  canEdit = () => true,
  currentPage = 1,
  itemsPerPage = 10,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">No</TableHead>
            <TableHead>Tahun</TableHead>
            <TableHead>Inspektorat</TableHead>
            <TableHead>Nama Perwadag</TableHead>
            <TableHead>Skor</TableHead>
            <TableHead>Status Penilaian Risiko</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Tidak ada data yang ditemukan.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{item.tahun}</TableCell>
                <TableCell>{item.inspektorat}</TableCell>
                <TableCell>{item.nama_perwadag}</TableCell>
                <TableCell>
                  {item.total_nilai_risiko ? Number(item.total_nilai_risiko).toFixed(1) : '-'}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.total_nilai_risiko !== null
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                    }`}>
                    {item.total_nilai_risiko !== null ? 'Lengkap' : 'Belum Lengkap'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <ActionDropdown
                    onView={() => onView?.(item)}
                    onEdit={canEdit(item) ? () => onEdit?.(item) : undefined}
                    onDelete={canEdit(item) ? () => onDelete?.(item) : undefined}
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