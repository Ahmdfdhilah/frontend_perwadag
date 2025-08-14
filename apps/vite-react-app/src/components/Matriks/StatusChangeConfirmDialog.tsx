import React from 'react';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import { MatriksStatus } from '@/services/matriks/types';

interface StatusChangeConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newStatus: MatriksStatus | null;
  onConfirm: () => void;
  loading?: boolean;
}

const StatusChangeConfirmDialog: React.FC<StatusChangeConfirmDialogProps> = ({
  open,
  onOpenChange,
  newStatus,
  onConfirm,
  loading = false,
}) => {
  const getStatusChangeMessage = (status: MatriksStatus | null) => {
    const baseMessage = "Apakah Anda yakin ingin mengubah status matriks ini";
    
    if (status === 'DRAFTING') {
      return `${baseMessage} kembali ke Draft? Tindakan ini akan mempengaruhi alur kerja matriks.`;
    }
    
    return `${baseMessage}? Tindakan ini akan mempengaruhi alur kerja matriks.`;
  };

  const getVariant = (status: MatriksStatus | null) => {
    return status === 'DRAFTING' ? 'destructive' : 'default';
  };

  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Konfirmasi Perubahan Status"
      description={getStatusChangeMessage(newStatus)}
      confirmText="Ya, Ubah Status"
      cancelText="Batal"
      onConfirm={onConfirm}
      loading={loading}
      variant={getVariant(newStatus) as 'default' | 'destructive'}
    />
  );
};

export default StatusChangeConfirmDialog;