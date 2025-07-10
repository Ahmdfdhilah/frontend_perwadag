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
import { ExitMeeting } from '@/mocks/exitMeeting';
import { formatIndonesianDateRange, formatIndonesianDate } from '@/utils/timeFormat';

interface ExitMeetingTableProps {
  data: ExitMeeting[];
  onView?: (item: ExitMeeting) => void;
  onEdit?: (item: ExitMeeting) => void;
  canEdit?: (item: ExitMeeting) => boolean;
}

const ExitMeetingTable: React.FC<ExitMeetingTableProps> = ({
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
            <TableHead>Tanggal Exit Meeting</TableHead>
            <TableHead>Tanggal Evaluasi</TableHead>
            <TableHead>Nama Perwadag</TableHead>
            <TableHead>Rincian</TableHead>
            <TableHead className="w-[80px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Tidak ada data exit meeting
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{formatIndonesianDate(item.tanggal)}</TableCell>
                <TableCell>{formatIndonesianDateRange(item.tanggalMulaiEvaluasi, item.tanggalAkhirEvaluasi)}</TableCell>
                <TableCell>{item.perwadagName}</TableCell>
                <TableCell className="max-w-xs truncate" title={item.rincian}>
                  {item.rincian}
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

export default ExitMeetingTable;