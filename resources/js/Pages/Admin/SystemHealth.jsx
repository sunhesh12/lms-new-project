import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Activity, Server, Database, Save, CheckCircle2, ChevronLeft } from "lucide-react";
import styles from "@/css/admin.module.css";

export default function SystemHealth({ health }) {
    const healthItems = [
        { label: "Overall Status", value: health.status, icon: <Activity />, status: "success" },
        { label: "Server Time", value: health.server_time, icon: <Server /> },
        { label: "PHP Version", value: health.php_version, icon: <Activity /> },
        { label: "Database Connection", value: health.database, icon: <Database />, status: health.database === 'Connected' ? "success" : "error" },
        { label: "Storage Permissions", value: health.storage_status, icon: <Save />, status: health.storage_status === 'Writable' ? "success" : "error" },
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className={styles.pageHeader}>System Health</h2>}
        >
            <Head title="System Health" />

            <div className={styles.adminContainer}>
                <header className={styles.header}>
                    <div className={styles.headerWithBack}>
                        <Link href={route('admin.dashboard')} className={styles.backLink}>
                            <ChevronLeft size={20} />
                            Dashboard
                        </Link>
                    </div>
                    <h1 className={styles.title}>Health Check Overview</h1>
                    <p className={styles.subtitle}>Current status of core system services.</p>
                </header>

                <div className={styles.healthGrid}>
                    {healthItems.map((item, idx) => (
                        <div key={idx} className={styles.healthCard}>
                            <div className={`${styles.healthIcon} ${item.status ? styles[item.status] : ''}`}>
                                {item.icon}
                            </div>
                            <div className={styles.healthInfo}>
                                <p className={styles.healthLabel}>{item.label}</p>
                                <p className={styles.healthValue}>{item.value}</p>
                            </div>
                            {item.status === 'success' && <CheckCircle2 className={styles.statusCheck} size={20} />}
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
