import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import styles from "@/css/module.module.css";
import Notification from "@/components/notification";
import DashboardCart from "@/components/DashboardCart";

export default function Course() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className={styles["header-container"]}>
                <h1 className="text-3xl font-bold">Module</h1>
                <button>Create Course</button>
            </div>
            <p>
                List of all the courses available throughout the degree
                programme.
            </p>
            <br></br>
            <div className={styles["course-container"]}>
                <div>
                    <p>Search</p>
                    <div className={styles["search-box"]}>
                        <img src="/icons/search.ico" alt="search icon" />
                        <input type="text" placeholder="Search for courses" />
                    </div>
                </div>
                <div>
                    <p>Degree</p>
                    <div className={styles["search-box"]}>
                        <img src="/icons/search.ico" alt="search icon" />
                        <input type="text" placeholder="Search for courses" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
