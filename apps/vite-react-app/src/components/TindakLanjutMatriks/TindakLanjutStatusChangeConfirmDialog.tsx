import React from 'react';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import { TindakLanjutStatus } from '@/services/matriks/types';

interface TindakLanjutStatusChangeConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newStatus: TindakLanjutStatus | null;
  onConfirm: () => void;
  loading?: boolean;
}

const TindakLanjutStatusChangeConfirmDialog: React.FC<TindakLanjutStatusChangeConfirmDialogProps> = ({
  open,
  onOpenChange,
  newStatus,
  onConfirm,
  loading = false,
}) => {
  const getStatusChangeMessage = (status: TindakLanjutStatus | null) => {
    const baseMessage = "Apakah Anda yakin ingin mengubah status tindak lanjut matriks ini";
    
    switch (status) {
      case 'DRAFTING':
        return `${baseMessage} kembali ke Draft? Tindakan ini akan mempengaruhi alur kerja tindak lanjut.`;
      case 'CHECKING':
        return `${baseMessage} ke Review Ketua Tim? Pastikan semua tindak lanjut telah diisi dengan benar.`;
      case 'VALIDATING':
        return `${baseMessage} ke Review Pengendali? Tim akan menvalidasi tindak lanjut yang telah dibuat.`;
      case 'FINISHED':
        return `${baseMessage} ke status Selesai? Tindakan ini akan menandai bahwa semua tindak lanjut telah selesai dilakukan.`;
      default:
        return `${baseMessage}? Tindakan ini akan mempengaruhi alur kerja tindak lanjut.`;
    }
  };

  const getStatusLabel = (status: TindakLanjutStatus | null) => {
    switch (status) {
      case 'DRAFTING':
        return 'Draft Tindak Lanjut';
      case 'CHECKING':
        return 'Review Ketua Tim';
      case 'VALIDATING':
        return 'Review Pengendali';
      case 'FINISHED':
        return 'Selesai';
      default:
        return 'Status Baru';
    }
  };

  const getVariant = (status: TindakLanjutStatus | null) => {
    return status === 'DRAFTING' ? 'destructive' : 'default';
  };

  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Konfirmasi Perubahan ke ${getStatusLabel(newStatus)}`}
      description={getStatusChangeMessage(newStatus)}
      confirmText="Ya, Ubah Status"
      cancelText="Batal"
      onConfirm={onConfirm}
      loading={loading}
      variant={getVariant(newStatus) as 'default' | 'destructive'}
    />
  );
};

export default TindakLanjutStatusChangeConfirmDialog;