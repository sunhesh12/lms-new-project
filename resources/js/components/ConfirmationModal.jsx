import React from 'react';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import styles from '@/css/modal.module.css';

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = 'danger',
    confirmText = 'Confirm',
    cancelText = 'Cancel'
}) {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'danger': return <AlertCircle size={32} />;
            case 'warning': return <AlertTriangle size={32} />;
            default: return <Info size={32} />;
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={`${styles.modal} ${styles[type]}`} onClick={e => e.stopPropagation()}>
                <div className={styles.iconWrapper}>
                    {getIcon()}
                </div>

                <h3 className={styles.title}>{title}</h3>
                <p className={styles.message}>{message}</p>

                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        {cancelText}
                    </button>
                    <button className={styles.confirmBtn} onClick={() => {
                        onConfirm();
                        onClose();
                    }}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
