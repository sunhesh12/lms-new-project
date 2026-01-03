import React from "react";
import styles from "@/css/notification.module.css";
import { Info, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function Notification({ topic, message, type, Link }) {
    const getIcon = () => {
        switch (type) {
            case "success": return <CheckCircle size={24} className={styles.iconSuccess} />;
            case "error": return <XCircle size={24} className={styles.iconError} />;
            case "noting": return <AlertCircle size={24} className={styles.iconNoting} />;
            default: return <Info size={24} className={styles.iconInfo} />;
        }
    };

    return (
        <div className={`${styles.notificationCard} ${styles[type] || ""}`}>
            <div className={styles.iconContainer}>
                {getIcon()}
            </div>
            <div className={styles.content}>
                <h3 className={styles.topic}>{topic}</h3>
                <p className={styles.message}>{message}</p>
                {Link && (
                    <a href={Link} className={styles.actionLink}>
                        View Details
                    </a>
                )}
            </div>
        </div>
    );
}
