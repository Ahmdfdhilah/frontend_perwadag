import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import ActionDropdown from '@/components/common/ActionDropdown';
import FileViewLink from '@/components/common/FileViewLink';
import { MatriksResponse } from '@/services/matriks/types';
import { formatIndonesianDateRange } from '@/utils/timeFormat';

interface MatriksCardsProps {
  data: MatriksResponse[];
  loading?: boolean;
  onEdit?: (item: MatriksResponse) => void;
  canEdit?: (item: MatriksResponse) => boolean;
  userRole: 'admin' | 'inspektorat' | 'perwadag';
}

const MatriksCards: React.FC<MatriksCardsProps> = ({
  data,
  loading = false,
  onEdit,
  canEdit,
  userRole,
}) => {

  const getStatusBadge = (matriks: MatriksResponse) => {
    const isCompleted = matriks.is_completed;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${isCompleted
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800'
        }`}>
        {isCompleted ? 'Lengkap' : 'Belum Lengkap'}
      </span>
    );
  };


  const renderDocumentLink = (matriks: MatriksResponse) => {
    return (
      <FileViewLink
        hasFile={matriks.has_file}
        fileUrls={matriks.file_urls}
        fileName={matriks.file_metadata?.original_filename}
        linkText="Lihat Dokumen"
      />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Loading matriks...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Tidak ada data matriks yang ditemukan.
      </div>
    );
  }

  const renderAdminInspektoratCard = (item: MatriksResponse, index: number) => (
    <Card key={item.id} className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">
            {item.nama_perwadag}
          </CardTitle>
          {canEdit?.(item) && (
            <ActionDropdown
              onEdit={() => onEdit?.(item)}
              showView={false}
              showEdit={!!onEdit}
              showDelete={false}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-muted-foreground">No:</span>
              <span className="ml-2">{index + 1}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Nomor Matriks:</span>
              <span className="ml-2">{item.nomor_matriks || '-'}</span>
            </div>
          </div>

          <div>
            <span className="font-medium text-muted-foreground">Tanggal Evaluasi:</span>
            <span className="ml-2">{formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai)}</span>
          </div>

          <div>
            <span className="font-medium text-muted-foreground">Dokumen:</span>
            <span className="ml-2">{renderDocumentLink(item)}</span>
          </div>

          <div>
            <span className="font-medium text-muted-foreground">Status:</span>
            <span className="ml-2">
              {getStatusBadge(item)}
            </span>
          </div>

          <div>
            <span className="font-medium text-muted-foreground">Kelengkapan:</span>
            <span className="ml-2 text-xs text-muted-foreground">
              {item.completion_percentage || 0}% lengkap
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPerwadagCard = (item: MatriksResponse, index: number) => (
    <Card key={item.id} className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">
            Matriks #{index + 1}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium text-muted-foreground">Tanggal Evaluasi:</span>
            <span className="ml-2">{formatIndonesianDateRange(item.tanggal_evaluasi_mulai, item.tanggal_evaluasi_selesai)}</span>
          </div>

          <div>
            <span className="font-medium text-muted-foreground">Dokumen:</span>
            <span className="ml-2">{renderDocumentLink(item)}</span>
          </div>

          <div>
            <span className="font-medium text-muted-foreground">Status:</span>
            <span className="ml-2">
              {getStatusBadge(item)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((item, index) => (
        userRole === 'perwadag'
          ? renderPerwadagCard(item, index)
          : renderAdminInspektoratCard(item, index)
      ))}
    </div>
  );
};

export default MatriksCards;