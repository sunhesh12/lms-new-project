import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Users, BookOpen, GraduationCap, Shield, UserCheck, Clock } from "lucide-react";
import styles from "@/css/admin.module.css";

export default function Dashboard({ stats, recent_users, notifications = [] }) {
    const statCards = [
        { label: "Total Users", value: stats.total_users, icon: <Users size={24} />, colorClass: styles.iconBlue },
        { label: "Students", value: stats.total_students, icon: <GraduationCap size={24} />, colorClass: styles.iconGreen },
        { label: "Lecturers", value: stats.total_lecturers, icon: <UserCheck size={24} />, colorClass: styles.iconIndigo },
        { label: "Courses", value: stats.total_courses, icon: <BookOpen size={24} />, colorClass: styles.iconPurple },
        { label: "Modules", value: stats.total_modules, icon: <Shield size={24} />, colorClass: styles.iconOrange },
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className={styles.pageHeader}>Admin Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className={styles.adminContainer}>
                <header className={styles.header}>
                    <h1 className={styles.title}>System Overview</h1>
                    <p className={styles.subtitle}>Manage your LMS platform and users.</p>
                </header>

                {/* Notifications Section */}
                {notifications.length > 0 && (
                    <div className={styles.notificationsWrapper}>
                        <h2 className={styles.sectionTitle}>Notifications & Tasks</h2>
                        <div className={styles.notificationsList}>
                            {notifications.map((notif) => (
                                <div key={notif.id} className={`${styles.notifItem} ${styles['notif-' + notif.type]}`}>
                                    <div className={styles.notifContent}>
                                        <h3 className={styles.notifTopic}>{notif.topic}</h3>
                                        <p className={styles.notifMessage}>{notif.message}</p>
                                    </div>
                                    {notif.link && (
                                        <Link href={notif.link} className={styles.notifLink}>
                                            View
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className={styles.statsGrid}>
                    {statCards.map((stat, idx) => (
                        <div key={idx} className={styles.statCard}>
                            <div className={`${styles.iconWrapper} ${stat.colorClass}`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className={styles.statLabel}>{stat.label}</p>
                                <p className={styles.statValue}>{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.contentGrid}>
                    {/* Recent Users */}
                    <div className={styles.recentUsersCard}>
                        <div className={styles.cardHeader}>
                            <h2 className={`${styles.cardTitle} ${styles.titleGroup}`}>
                                <Clock size={20} className={styles.titleIcon} />
                                Recently Joined
                            </h2>
                            <Link href={route('admin.users.index')} className={styles.viewAllLink}>
                                View All Users
                            </Link>
                        </div>

                        <div className={styles.userList}>
                            {recent_users.map((user) => (
                                <div key={user.id} className={styles.userItem}>
                                    <div className={styles.userInfo}>
                                        <div className={styles.userAvatar}>
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <p className={styles.userName}>{user.name}</p>
                                            <p className={styles.userEmail}>{user.email}</p>
                                        </div>
                                    </div>
                                    <span className={styles.roleBadge}>
                                        {user.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className={styles.masterControlsCard}>
                        <h2 className={styles.masterTitle}>Master Controls</h2>
                        <div className={styles.controlButtons}>
                            <Link href={route('admin.users.index')} className={styles.controlBtn}>
                                User Management
                            </Link>
                            <Link href="/modules" className={styles.controlBtn}>
                                Content Review
                            </Link>
                            <button className={`${styles.controlBtn} ${styles.primaryControlBtn}`}>
                                System Health
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
