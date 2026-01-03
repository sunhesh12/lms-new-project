import React, { useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Users,
    BookOpen,
    GraduationCap,
    Shield,
    UserCheck,
    Clock,
    BarChart3,
    TrendingUp,
    ShieldCheck,
    AlertCircle,
    LayoutDashboard,
    Zap,
    ExternalLink,
    FileText,
    Printer,
    FileSearch,
    Info
} from "lucide-react";
import { Chart } from "react-charts";
import styles from "@/css/admin.module.css";

export default function Dashboard({ stats, recent_users, popular_modules = [], notifications = [], charts = {} }) {
    const statCards = [
        {
            label: "Total Users",
            value: stats.total_users,
            icon: <Users size={24} />,
            colorClass: styles.iconBlue,
            link: route('admin.users.index'),
            subStats: [
                { label: "Active", value: stats.active_users },
                { label: "Blocked", value: stats.blocked_users }
            ]
        },
        {
            label: "Students",
            value: stats.total_students,
            icon: <GraduationCap size={24} />,
            colorClass: styles.iconGreen,
            link: route('admin.users.index')
        },
        {
            label: "Lecturers",
            value: stats.total_lecturers,
            icon: <UserCheck size={24} />,
            colorClass: styles.iconIndigo,
            link: route('admin.users.index')
        },
        {
            label: "Curriculum",
            value: stats.total_courses,
            icon: <BookOpen size={24} />,
            colorClass: styles.iconPurple,
            link: '/modules',
            subLabel: `${stats.total_modules} Modules`
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className={styles.headerLayout}>
                    <h2
                        className={styles.pageHeader}
                        data-date={new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    >
                        System Console
                    </h2>
                    <div className={styles.headerActions}>
                        <button onClick={() => window.print()} className={styles.printBtn}>
                            <Printer size={16} /> Export Report
                        </button>
                        <Link href={route('admin.health')} className={styles.healthLink}>
                            <Zap size={14} /> System Health
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className={styles.adminContainer}>
                {/* Stats Grid */}
                <div className={styles.statsGrid}>
                    {statCards.map((stat, idx) => (
                        <div key={idx} className={styles.statCard}>
                            <div className={styles.statMain}>
                                <div className={`${styles.iconWrapper} ${stat.colorClass}`}>
                                    {stat.icon}
                                </div>
                                <div className={styles.statInfo}>
                                    <p className={styles.statLabel}>{stat.label}</p>
                                    <p className={styles.statValue}>{stat.value}</p>
                                    {stat.subLabel && <p className={styles.moduleSub}>{stat.subLabel}</p>}
                                </div>
                            </div>

                            {stat.subStats && (
                                <div className={styles.statBadgeGrid}>
                                    {stat.subStats.map((sub, sidx) => (
                                        <div key={sidx} className={styles.statBadge}>
                                            <span className={styles.badgeLabel}>{sub.label}</span>
                                            <span className={styles.badgeValue}>{sub.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {stat.link && (
                                <Link href={stat.link} className={styles.statLink}>
                                    <ExternalLink size={14} />
                                </Link>
                            )}
                        </div>
                    ))}
                </div>

                {/* Popular Modules & Notifications */}
                <div className={styles.analyticsGrid}>
                    <div className={styles.popularModulesCard}>
                        <div className={styles.chartHeader}>
                            <TrendingUp size={18} className={styles.chartIcon} />
                            <h3 className={styles.chartTitle}>Top Performing Modules</h3>
                        </div>
                        <div className={styles.moduleGrid}>
                            {popular_modules.map((module) => (
                                <Link
                                    key={module.id}
                                    href={route('module.show', module.id)}
                                    className={styles.moduleItem}
                                >
                                    <div className={styles.moduleIcon}>
                                        <BookOpen size={18} />
                                    </div>
                                    <div className={styles.moduleMain}>
                                        <span className={styles.moduleLabel}>{module.name}</span>
                                        <span className={styles.moduleSub}>{module.module_code || module.code}</span>
                                    </div>
                                    <div className={styles.enrollmentBadge}>
                                        {module.enrolled_count || 0} Students
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <TrendingUp size={18} className={styles.chartIcon} />
                            <h3 className={styles.chartTitle}>User Growth Trend</h3>
                        </div>
                        <div className={styles.chartContainer}>
                            {charts.registrationTrends?.length > 0 ? (
                                <Chart
                                    options={{
                                        data: [{
                                            label: 'Registrations',
                                            data: charts.registrationTrends.map(d => ({
                                                primary: d.date,
                                                secondary: d.count
                                            }))
                                        }],
                                        primaryAxis: {
                                            getValue: datum => datum.primary,
                                        },
                                        secondaryAxes: [{
                                            getValue: datum => datum.secondary,
                                            elementType: 'area',
                                        }],
                                    }}
                                />
                            ) : (
                                <div className={styles.emptyState}>No registration data available</div>
                            )}
                        </div>
                    </div>

                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <BarChart3 size={18} className={styles.chartIcon} />
                            <h3 className={styles.chartTitle}>Role Distribution</h3>
                        </div>
                        <div className={styles.chartContainer}>
                            {charts.roleDistribution?.length > 0 ? (
                                <Chart
                                    options={{
                                        data: [{
                                            label: 'Users',
                                            data: charts.roleDistribution.map(d => ({
                                                primary: d.role,
                                                secondary: d.count
                                            }))
                                        }],
                                        primaryAxis: {
                                            getValue: datum => datum.primary,
                                        },
                                        secondaryAxes: [{
                                            getValue: datum => datum.secondary,
                                            elementType: 'bar',
                                        }],
                                    }}
                                />
                            ) : (
                                <div className={styles.emptyState}>No distribution data available</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.contentGrid}>
                    <div className={styles.recentUsersCard}>
                        <div className={styles.cardHeader}>
                            <h2 className={`${styles.cardTitle} ${styles.titleGroup}`}>
                                <Clock size={20} className={styles.titleIcon} />
                                New Registrations
                            </h2>
                            <Link href={route('admin.users.index')} className={styles.viewAllLink}>
                                Directory
                            </Link>
                        </div>

                        <div className={styles.userList}>
                            {recent_users.map((user) => (
                                <div key={user.id} className={styles.userItem}>
                                    <div className={styles.userInfo}>
                                        <img
                                            src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                                            className={styles.userAvatarSmall}
                                            alt=""
                                        />
                                        <div>
                                            <p className={styles.userName}>{user.name}</p>
                                            <p className={styles.userEmail}>{user.email}</p>
                                        </div>
                                    </div>
                                    <span className={`${styles.roleBadge} ${styles['role-' + user.role]}`}>
                                        {user.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.masterControlsCard}>
                        <h2 className={styles.masterTitle}>Quick Access</h2>
                        <div className={styles.controlButtons}>
                            <Link href={route('admin.users.index')} className={styles.controlBtn}>
                                <Users size={16} /> Users
                            </Link>
                            <Link href="/modules" className={styles.controlBtn}>
                                <BookOpen size={16} /> Modules
                            </Link>
                            <Link href={route('admin.examinations')} className={styles.controlBtn}>
                                <FileText size={16} /> Exams
                            </Link>
                            <Link href={route('admin.statuses.index')} className={styles.controlBtn}>
                                <Info size={16} /> Statuses
                            </Link>
                            <Link href={route('admin.health')} className={styles.controlBtn}>
                                <ShieldCheck size={16} /> Health
                            </Link>
                        </div>
                    </div>
                </div>

                {/* System Documentation Preview */}
                <div className={styles.documentationCard}>
                    <h3 className={styles.docTitle}>
                        <FileSearch size={22} className={styles.titleIcon} />
                        System Documentation & Audit
                    </h3>
                    <div className={styles.docContent}>
                        <div className={styles.docSection}>
                            <h4>1. Operational Overview</h4>
                            <p>This report provides a multi-dimensional view of the LMS ecosystem, including user demographics, engagement metrics, and resource distribution. Data is aggregated in real-time from the central database.</p>
                        </div>
                        <div className={styles.docSection}>
                            <h4>2. Security & Compliance</h4>
                            <p>All system actions are logged under the high-security audit trail. Student data is managed in compliance with educational privacy standards. Blocked users are restricted from all academic activities until administrative review.</p>
                        </div>
                        <div className={styles.docSection}>
                            <h4>3. Technical Health</h4>
                            <p>The system is currently running on Laravel 11 / React 18 architecture. Database integrity checks are performed every 24 hours. Automated backups are active and verified.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
