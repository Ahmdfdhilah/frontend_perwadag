import React from 'react';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';

interface TemuanDeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  temuanIndex: number | null;
  onConfirm: () => void;
}

const TemuanDeleteConfirmDialog: React.FC<TemuanDeleteConfirmDialogProps> = ({
  open,
  onOpenChange,
  temuanIndex,
  onConfirm,
}) => {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Hapus Temuan Rekomendasi"
      description={`Apakah Anda yakin ingin menghapus temuan rekomendasi nomor ${(temuanIndex ?? 0) + 1}? Tindakan ini tidak dapat dibatalkan.`}
      confirmText="Hapus"
      cancelText="Batal"
      onConfirm={onConfirm}
      variant="destructive"
    />
  );
};

export default TemuanDeleteConfirmDialog;