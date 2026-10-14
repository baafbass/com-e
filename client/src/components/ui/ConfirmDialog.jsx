import { useState } from 'react';
import Modal from './Modal';

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onClose,
}) {
  const [isWorking, setIsWorking] = useState(false);

  const handleConfirm = async () => {
    setIsWorking(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <Modal id="confirm-dialog" title={title} isOpen={isOpen} onClose={onClose} size="sm">
      <p className="confirm-dialog__message">{message}</p>
      <div className="form-actions">
        <button type="button" id="confirm-cancel" className="btn btn--ghost" onClick={onClose} disabled={isWorking}>
          Cancel
        </button>
        <button
          type="button"
          id="confirm-accept"
          className="btn btn--danger"
          onClick={handleConfirm}
          disabled={isWorking}
        >
          {isWorking ? 'Working...' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
