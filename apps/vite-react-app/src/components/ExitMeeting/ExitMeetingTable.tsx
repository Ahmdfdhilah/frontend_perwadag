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
            <TableHead>Nama Perwadag</TableHead>
            <TableHead>Tanggal Evaluasi</TableHead>
            <TableHead>Tanggal Exit Meeting</TableHead>
            <TableHead>Link Zoom</TableHead>
            <TableHead className="w-[80px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Tidak ada data exit meeting
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => {


              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{item.perwadagName}</TableCell>
                  <TableCell>{formatIndonesianDateRange(item.tanggalMulaiEvaluasi, item.tanggalAkhirEvaluasi)}</TableCell>
                  <TableCell>{formatIndonesianDate(item.tanggal)}</TableCell>
                  <TableCell>
                    {item.linkZoom ? (
                      <a
                        href={item.linkZoom}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Join Meeting
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
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExitMeetingTable;