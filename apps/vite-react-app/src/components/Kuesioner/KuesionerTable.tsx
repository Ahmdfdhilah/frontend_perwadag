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
import { Kuesioner } from '@/mocks/kuesioner';
import { formatIndonesianDateRange, formatIndonesianDate } from '@/utils/timeFormat';

interface KuesionerTableProps {
  data: Kuesioner[];
  onView?: (item: Kuesioner) => void;
  onEdit?: (item: Kuesioner) => void;
  canEdit?: (item: Kuesioner) => boolean;
}

const KuesionerTable: React.FC<KuesionerTableProps> = ({
  data,
  onView,
  onEdit,
  canEdit,
}) => {


  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Tanggal Kuesioner</TableHead>
            <TableHead>Tanggal Evaluasi</TableHead>
            <TableHead>Nama Perwadag</TableHead>
            <TableHead>Link Dokumen</TableHead>
            <TableHead className="w-[80px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Tidak ada data kuesioner
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{formatIndonesianDate(item.tanggal)}</TableCell>
                <TableCell>{formatIndonesianDateRange(item.tanggalMulaiEvaluasi, item.tanggalAkhirEvaluasi)}</TableCell>
                <TableCell>{item.perwadagName}</TableCell>
                <TableCell>
                  {item.linkDokumen ? (
                    <a
                      href={item.linkDokumen}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View Document
                    </a>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <ActionDropdown
                    onView={() => onView?.(item)}
                    onEdit={canEdit?.(item) ? () => onEdit?.(item) : undefined}
                    showView={true}
                    showEdit={canEdit?.(item) && !!onEdit}
                    showDelete={false}
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

export default KuesionerTable;