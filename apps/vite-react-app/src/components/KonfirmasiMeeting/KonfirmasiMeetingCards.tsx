import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { KonfirmasiMeeting, getKonfirmasiMeetingStatus } from '@/mocks/konfirmasiMeeting';
import ActionDropdown from '@/components/common/ActionDropdown';
import { formatIndonesianDateRange, formatIndonesianDate } from '@/utils/timeFormat';

interface KonfirmasiMeetingCardsProps {
  data: KonfirmasiMeeting[];
  onView?: (item: KonfirmasiMeeting) => void;
  onEdit?: (item: KonfirmasiMeeting) => void;
  canEdit?: (item: KonfirmasiMeeting) => boolean;
}

const KonfirmasiMeetingCards: React.FC<KonfirmasiMeetingCardsProps> = ({
  data,
  onView,
  onEdit,
  canEdit,
}) => {

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Tidak ada data konfirmasi meeting yang ditemukan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((item) => {

        return (
          <Card key={item.id} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold">
                  {item.perwadagName}
                </CardTitle>
                <ActionDropdown
                  onView={() => onView?.(item)}
                  onEdit={canEdit?.(item) ? () => onEdit?.(item) : undefined}
                  showView={true}
                  showEdit={canEdit?.(item) && !!onEdit}
                  showDelete={false}
                />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">No:</span>
                  <span className="ml-2">{item.no}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Tanggal Evaluasi:</span>
                  <span className="ml-2">{formatIndonesianDateRange(item.tanggalMulaiEvaluasi, item.tanggalAkhirEvaluasi)}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Tanggal Konfirmasi:</span>
                  <span className="ml-2">{formatIndonesianDate(item.tanggalKonfirmasi)}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Link Zoom:</span>
                  {item.linkZoom ? (
                    <a
                      href={item.linkZoom}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:text-blue-800 underline"
                    >
                      Join Meeting
                    </a>
                  ) : (
                    <span className="ml-2 text-muted-foreground">-</span>
                  )}
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Daftar Hadir:</span>
                  {item.linkDaftarHadir ? (
                    <a
                      href={item.linkDaftarHadir}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:text-blue-800 underline"
                    >
                      Lihat Daftar Hadir
                    </a>
                  ) : (
                    <span className="ml-2 text-muted-foreground">-</span>
                  )}
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Status Dokumen:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getKonfirmasiMeetingStatus(item) === 'Lengkap'
                      ? 'bg-green-100 text-green-800'
                      : getKonfirmasiMeetingStatus(item) === 'Sebagian'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {getKonfirmasiMeetingStatus(item)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default KonfirmasiMeetingCards;