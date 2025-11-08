import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import styles from "@/css/dashboard.module.css";
import Notification from "@/components/notification";
import DashboardCart from "@/components/DashboardCart";

export default function Dashboard() {
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
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className="p-8 text-gray-800">
                <h1 className="text-3xl font-bold">
                    {getGreeting()} <span>{formatName(User?.name)}</span>.
                </h1>
                {/* <p className="mt-4 text-lg text-gray-600">
                    Welcome to your dashboard! Here you can manage your account and view your recent activities.
                </p> */}
                <div className={styles["dashboard-notifications-container"]}>
                    <Notification
                        message={"This is a success notification!"}
                        Link={"#"}
                        type={"success"}
                    ></Notification>
                    <Notification
                        message={"This is a error notification!"}
                        Link={"#"}
                        type={"error"}
                    ></Notification>

                    <Notification
                        message={"This is a error notification!"}
                        Link={"#"}
                        type={"noting"}
                    ></Notification>
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
