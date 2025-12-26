import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import styles from "@/css/dashboard.module.css";
import Notification from "@/components/notification";
import DashboardCart from "@/components/DashboardCart";

export default function Dashboard({ notifications = [] }) {
    const User = usePage().props.auth.user;

    // Format the user's name nicely (e.g., J. D. SMITH)
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

    // Generate a time-based greeting
    function getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning,";
        if (hour < 18) return "Good Afternoon,";
        return "Good Evening,";
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className={styles["dashboard-header"]}>
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className={styles["dashboard-main"]}>
                <h1 className={styles["dashboard-greeting"]}>
                    {getGreeting()} <span>{formatName(User?.name)}</span>.
                </h1>

                <div className={styles["dashboard-notifications-container"]}>
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <Notification
                                key={notif.id}
                                topic={notif.topic}
                                message={notif.message}
                                type={notif.type}
                                Link={notif.link}
                            />
                        ))
                    ) : (
                        <p className={styles.noNotifications}>No new notifications.</p>
                    )}
                </div>
                <div>
                    <br></br>
                    <h2 className={styles["dashboard-title"]}>
                        Continue your journey of teaching
                    </h2>
                    <DashboardCart />
                </div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </AuthenticatedLayout>
    );
}
