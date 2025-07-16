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
import { MeetingResponse } from '@/services/meeting/types';
import { formatIndonesianDateRange, formatIndonesianDate } from '@/utils/timeFormat';

interface ExitMeetingTableProps {
  data: MeetingResponse[];
  loading?: boolean;
  onView?: (item: MeetingResponse) => void;
  onEdit?: (item: MeetingResponse) => void;
  canEdit?: (item: MeetingResponse) => boolean;
}

const ExitMeetingTable: React.FC<ExitMeetingTableProps> = ({
  data,
  loading = false,
  onView,
  onEdit,
  canEdit,
}) => {

  const getStatusBadge = (meeting: MeetingResponse) => {
    const isCompleted = meeting.is_completed;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        isCompleted
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isCompleted ? 'Lengkap' : 'Belum Lengkap'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Loading meetings...
      </div>
    );
  }

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
            <TableHead>Daftar Hadir</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                Tidak ada data exit meeting yang ditemukan.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => {
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{item.nama_perwadag}</TableCell>
                  <TableCell>{formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai)}</TableCell>
                  <TableCell>{item.tanggal_meeting ? formatIndonesianDate(item.tanggal_meeting) : '-'}</TableCell>
                  <TableCell>
                    {item.link_zoom ? (
                      <a
                        href={item.link_zoom}
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
                    {item.link_daftar_hadir ? (
                      <a
                        href={item.link_daftar_hadir}
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
                    {getStatusBadge(item)}
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