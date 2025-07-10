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
import { EntryMeeting, getEntryMeetingStatus } from '@/mocks/entryMeeting';
import { formatIndonesianDateRange, formatIndonesianDate } from '@/utils/timeFormat';

interface EntryMeetingTableProps {
  data: EntryMeeting[];
  onView?: (item: EntryMeeting) => void;
  onEdit?: (item: EntryMeeting) => void;
  canEdit?: (item: EntryMeeting) => boolean;
}

const EntryMeetingTable: React.FC<EntryMeetingTableProps> = ({
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
            <TableHead>Tanggal Entry Meeting</TableHead>
            <TableHead>Link Zoom</TableHead>
            <TableHead>Daftar Hadir</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                Tidak ada data entry meeting
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
                    {item.linkDaftarHadir ? (
                      <a
                        href={item.linkDaftarHadir}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Lihat Daftar Hadir
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getEntryMeetingStatus(item) === 'Lengkap' 
                        ? 'bg-green-100 text-green-800' 
                        : getEntryMeetingStatus(item) === 'Sebagian'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {getEntryMeetingStatus(item)}
                    </span>
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

export default EntryMeetingTable;