import React, { useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Users, BookOpen, GraduationCap, Shield, UserCheck, Clock, BarChart3, PieChart, TrendingUp } from "lucide-react";
import { Chart } from "react-charts";
import styles from "@/css/admin.module.css";

export default function Dashboard({ stats, recent_users, notifications = [], charts = {} }) {
    const statCards = [
        { label: "Total Users", value: stats.total_users, icon: <Users size={24} />, colorClass: styles.iconBlue, link: route('admin.users.index') },
        { label: "Students", value: stats.total_students, icon: <GraduationCap size={24} />, colorClass: styles.iconGreen, link: route('admin.users.index') },
        { label: "Lecturers", value: stats.total_lecturers, icon: <UserCheck size={24} />, colorClass: styles.iconIndigo, link: route('admin.users.index') },
        { label: "Courses", value: stats.total_courses, icon: <BookOpen size={24} />, colorClass: styles.iconPurple, link: '/modules' },
        { label: "Modules", value: stats.total_modules, icon: <Shield size={24} />, colorClass: styles.iconOrange, link: '/modules' },
    ];

    // Registration Trend Chart Data
    const trendData = useMemo(() => [
        {
            label: "Registrations",
            data: charts.registrationTrends?.map(d => ({
                primary: new Date(d.date),
                secondary: d.count
            })) || []
        }
    ], [charts.registrationTrends]);

    const trendPrimaryAxis = useMemo(() => ({
        getValue: datum => datum.primary,
    }), []);

    const trendSecondaryAxes = useMemo(() => [{
        getValue: datum => datum.secondary,
        elementType: 'line'
    }], []);

    // Role Distribution View (Simple bars as Pie is tricky in react-charts v3 beta)
    const roleData = useMemo(() => [
        {
            label: "Users",
            data: charts.roleDistribution?.map(d => ({
                primary: d.role,
                secondary: d.count
            })) || []
        }
    ], [charts.roleDistribution]);

    const rolePrimaryAxis = useMemo(() => ({
        getValue: datum => datum.primary,
    }), []);

    const roleSecondaryAxes = useMemo(() => [{
        getValue: datum => datum.secondary,
        elementType: 'bar'
    }], []);

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
                        <Link
                            key={idx}
                            href={stat.link || '#'}
                            className={styles.statCard}
                            style={{ textDecoration: 'none' }}
                        >
                            <div className={`${styles.iconWrapper} ${stat.colorClass}`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className={styles.statLabel}>{stat.label}</p>
                                <p className={styles.statValue}>{stat.value}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Analytics Section */}
                <div className={styles.analyticsGrid}>
                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <TrendingUp size={18} className={styles.chartIcon} />
                            <h3 className={styles.chartTitle}>Registration Trends</h3>
                        </div>
                        <div className={styles.chartContainer}>
                            <Chart
                                options={{
                                    data: trendData,
                                    primaryAxis: trendPrimaryAxis,
                                    secondaryAxes: trendSecondaryAxes,
                                }}
                            />
                        </div>
                    </div>

                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <BarChart3 size={18} className={styles.chartIcon} />
                            <h3 className={styles.chartTitle}>Role Distribution</h3>
                        </div>
                        <div className={styles.chartContainer}>
                            <Chart
                                options={{
                                    data: roleData,
                                    primaryAxis: rolePrimaryAxis,
                                    secondaryAxes: roleSecondaryAxes,
                                }}
                            />
                        </div>
                    </div>
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
                            <Link href={route('admin.health')} className={`${styles.controlBtn} ${styles.primaryControlBtn}`}>
                                System Health
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
