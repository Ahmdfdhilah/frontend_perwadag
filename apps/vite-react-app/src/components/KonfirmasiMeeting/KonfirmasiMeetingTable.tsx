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
import { KonfirmasiMeeting, getKonfirmasiMeetingStatus } from '@/mocks/konfirmasiMeeting';
import { formatIndonesianDateRange, formatIndonesianDate } from '@/utils/timeFormat';
import { Badge } from '@workspace/ui/components/badge';

interface KonfirmasiMeetingTableProps {
  data: KonfirmasiMeeting[];
  onView?: (item: KonfirmasiMeeting) => void;
  onEdit?: (item: KonfirmasiMeeting) => void;
  canEdit?: (item: KonfirmasiMeeting) => boolean;
}

const KonfirmasiMeetingTable: React.FC<KonfirmasiMeetingTableProps> = ({
  data,
  onView,
  onEdit,
  canEdit,
}) => {
  const getStatusBadge = (status: string, hasDocuments: boolean) => {
    if (status === 'completed' && hasDocuments) {
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Selesai</Badge>;
    } else if (status === 'confirmed') {
      return <Badge variant="secondary">Dikonfirmasi</Badge>;
    } else {
      return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama Perwadag</TableHead>
            <TableHead>Tanggal Evaluasi</TableHead>
            <TableHead>Tanggal Konfirmasi</TableHead>
            <TableHead>Link Zoom</TableHead>
            <TableHead>Daftar Hadir</TableHead>
            <TableHead>Status Meeting</TableHead>
            <TableHead>Status Dokumen</TableHead>
            <TableHead className="w-[80px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                Tidak ada data konfirmasi meeting
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => {
              const hasDocuments = !!(item.linkDaftarHadir || (item.buktiImages && item.buktiImages.length > 0));
              
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.no}</TableCell>
                  <TableCell>{item.perwadagName}</TableCell>
                  <TableCell>{formatIndonesianDateRange(item.tanggalMulaiEvaluasi, item.tanggalAkhirEvaluasi)}</TableCell>
                  <TableCell>{formatIndonesianDate(item.tanggalKonfirmasi)}</TableCell>
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
                    {getStatusBadge(item.status, hasDocuments)}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getKonfirmasiMeetingStatus(item) === 'Lengkap' 
                        ? 'bg-green-100 text-green-800' 
                        : getKonfirmasiMeetingStatus(item) === 'Sebagian'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {getKonfirmasiMeetingStatus(item)}
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

export default KonfirmasiMeetingTable;