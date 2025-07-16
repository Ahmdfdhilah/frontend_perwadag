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
import { Badge } from '@workspace/ui/components/badge';
import { PenilaianRisikoResponse } from '@/services/penilaianRisiko/types';
import ActionDropdown from '@/components/common/ActionDropdown';

interface RiskAssessmentTableProps {
  data: PenilaianRisikoResponse[];
  loading?: boolean;
  onView?: (item: PenilaianRisikoResponse) => void;
  onEdit?: (item: PenilaianRisikoResponse) => void;
  onDelete?: (item: PenilaianRisikoResponse) => void;
  canEdit?: () => boolean;
}

const RiskAssessmentTable: React.FC<RiskAssessmentTableProps> = ({
  data,
  loading = false,
  onView,
  onEdit,
  onDelete,
  canEdit = () => true,
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
            <TableHead>Profil Risiko Auditan</TableHead>
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
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item.tahun}</TableCell>
                <TableCell>{item.inspektorat}</TableCell>
                <TableCell>{item.nama_perwadag}</TableCell>
                <TableCell>
                  {item.skor_rata_rata?.toFixed(1) || '-'}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      item.profil_risiko_auditan === 'Tinggi' ? 'destructive' :
                      item.profil_risiko_auditan === 'Sedang' ? 'default' : 'secondary'
                    }
                  >
                    {item.profil_risiko_auditan || 'Belum Dinilai'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <ActionDropdown
                    onView={() => onView?.(item)}
                    onEdit={canEdit() ? () => onEdit?.(item) : undefined}
                    onDelete={canEdit() ? () => onDelete?.(item) : undefined}
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