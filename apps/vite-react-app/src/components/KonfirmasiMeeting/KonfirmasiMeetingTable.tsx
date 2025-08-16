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
import ActionDropdown from '@/components/common/ActionDropdown';
import FileViewLink from '@/components/common/FileViewLink';
import { MeetingResponse } from '@/services/meeting/types';
import { formatIndonesianDateRange, formatDateWithHoursFromAPI } from '@/utils/timeFormat';

interface KonfirmasiMeetingTableProps {
  data: MeetingResponse[];
  loading?: boolean;
  onView?: (item: MeetingResponse) => void;
  onEdit?: (item: MeetingResponse) => void;
  canEdit?: (item: MeetingResponse) => boolean;
  currentPage?: number;
  itemsPerPage?: number;
}

const KonfirmasiMeetingTable: React.FC<KonfirmasiMeetingTableProps> = ({
  data,
  loading = false,
  onView,
  onEdit,
  canEdit,
  currentPage = 1,
  itemsPerPage = 10,
}) => {

  const getStatusBadge = (meeting: MeetingResponse) => {
    const isCompleted = meeting.is_completed;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium
    ${isCompleted
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
          }`}
      >
        {isCompleted ? 'Lengkap' : 'Belum Lengkap'}
      </span>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama Perwadag</TableHead>
            <TableHead>Tanggal Evaluasi</TableHead>
            <TableHead>Tanggal Konfirmasi Meeting</TableHead>
            <TableHead>Link Zoom</TableHead>
            <TableHead>Daftar Hadir</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                Tidak ada data konfirmasi meeting yang ditemukan.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => {
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell>{item.nama_perwadag}</TableCell>
                  <TableCell>{formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai)}</TableCell>
                  <TableCell>{item.tanggal_meeting ? formatDateWithHoursFromAPI(item.tanggal_meeting) : '-'}</TableCell>
                  <TableCell>
                    <FileViewLink
                      externalUrl={item.link_zoom}
                      emptyText="Belum ada link zoom"
                      className="text-sm truncate max-w-48 text-primary hover:text-primary/80 underline"
                    />
                  </TableCell>
                  <TableCell>
                    <FileViewLink
                      externalUrl={item.link_daftar_hadir}
                      emptyText="Belum ada link daftar hadir"
                      className="text-sm truncate max-w-48 text-primary hover:text-primary/80 underline"
                    />
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

export default KonfirmasiMeetingTable;