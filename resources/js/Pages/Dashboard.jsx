import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import {
    BookOpen,
    Bell,
    Users,
    Compass,
    ChevronRight,
    Sparkles,
    Layout
} from "lucide-react";
import styles from "@/css/dashboard.module.css";
import Notification from "@/components/notification";
import DashboardCart from "@/components/DashboardCart";

export default function Dashboard({ notifications = [], frequent_modules = [] }) {
    const { auth } = usePage().props;
    const User = auth.user;

    function formatName(name) {
        if (!name) return "";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0];
        const lastName = parts[parts.length - 1];
        const initials = parts
            .slice(0, -1)
            .map((n) => n[0].toUpperCase() + ".")
            .join(" ");
        return `${initials} ${lastName.toUpperCase()}`;
    }

    function getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    }

    return (
        <AuthenticatedLayout
            header={<h2 className={styles["dashboard-header"]}>Learning Console</h2>}
        >
            <Head title="Dashboard" />

            <div className={styles["dashboard-main"]}>
                <header className={styles.mb8}>
                    <h1 className={styles["dashboard-greeting"]}>
                        {getGreeting()}, <span>{formatName(User?.name)}</span>.
                        <Sparkles className={styles["title-icon"]} size={28} style={{ marginLeft: '10px' }} />
                    </h1>
                </header>

                <div className={styles["section-grid"]}>
                    {/* Left Column: Main Content */}
                    <div className={styles.mainColumn}>

                        {/* Frequent Modules Section */}
                        {frequent_modules.length > 0 && (
                            <section className={`${styles["glass-card"]} ${styles.mb8}`}>
                                <h2 className={styles["section-title"]}>
                                    <BookOpen className={styles["title-icon"]} size={20} />
                                    {User.role === 'admin' ? "Popular System Modules" : "My Active Modules"}
                                </h2>
                                <div className={styles["modules-scroll"]}>
                                    {frequent_modules.map((module) => (
                                        <Link
                                            key={module.id}
                                            href={route('module.show', module.id)}
                                            className={styles["module-card"]}
                                        >
                                            <div className={styles["module-icon-box"]}>
                                                <Layout size={20} />
                                            </div>
                                            <div>
                                                <span className={styles["module-code"]}>{module.module_code || module.code}</span>
                                                <h3 className={styles["module-name"]}>{module.name}</h3>
                                            </div>
                                            <div className={styles["module-footer"]}>
                                                <span className={styles["student-count"]}>
                                                    <Users size={12} />
                                                    {module.students_count || 0} Enrolled
                                                </span>
                                                <ChevronRight size={16} color="#94a3b8" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Journey/Actions Section */}
                        <section className={styles["glass-card"]}>
                            <h2 className={styles["section-title"]}>
                                <Compass className={styles["title-icon"]} size={20} />
                                Continue Your Journey
                            </h2>
                            <DashboardCart />
                        </section>
                    </div>

                    {/* Right Column: Notifications/Updates */}
                    <aside className={styles.sideColumn}>
                        <div className={`${styles["glass-card"]} ${styles["notifications-wrapper"]}`}>
                            <h2 className={styles["section-title"]}>
                                <Bell className={styles["title-icon"]} size={20} />
                                Recent Updates
                            </h2>
                            {notifications.length > 0 ? (
                                <div className={styles.notifList}>
                                    {notifications.map((notif) => (
                                        <Notification
                                            key={notif.id}
                                            topic={notif.data?.topic || notif.topic}
                                            message={notif.data?.message || notif.message}
                                            type={notif.data?.type || notif.type}
                                            Link={notif.data?.link || notif.link}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className={styles["empty-state"]}>
                                    <Bell size={48} className={styles["empty-icon"]} />
                                    <p>Your workspace is quiet today. No new notifications.</p>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
