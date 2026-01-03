import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import styles from '@/css/toast.module.css';

export default function Toast() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (flash && (flash.message || flash.success || flash.error)) {
            setNotification({
                type: flash.error ? 'error' : (flash.success ? 'success' : 'info'),
                message: flash.message || flash.success || flash.error,
                title: flash.error ? 'Error' : (flash.success ? 'Success' : 'Notification')
            });
            setVisible(true);

            const timer = setTimeout(() => {
                setVisible(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!visible || !notification) return null;

    const getIcon = () => {
        switch (notification.type) {
            case 'success': return <CheckCircle size={24} className={styles.icon} />;
            case 'error': return <XCircle size={24} className={styles.icon} />;
            default: return <Info size={24} className={styles.icon} />;
        }
    };

    return (
        <div className={styles.toastContainer}>
            <div className={`${styles.toast} ${styles[notification.type]}`}>
                {getIcon()}

                <div className={styles.content}>
                    <div className={styles.title}>{notification.title}</div>
                    <div className={styles.message}>{notification.message}</div>
                </div>

                <button
                    onClick={() => setVisible(false)}
                    className={styles.closeBtn}
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
