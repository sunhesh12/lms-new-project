import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import styles from "@/css/modules.module.css";
import Notification from "@/components/notification";
import DashboardCart from "@/components/DashboardCart";

export default function Course({ courses }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user?.role === 'admin';

    return (
        <AuthenticatedLayout
            header={
                <h2 className={styles.pageHeader}>
                    Courses
                </h2>
            }
        >
            <Head title="Courses" />

            <div className={styles.headerContainer}>
                <h1 className={styles.mainTitle}>Courses</h1>
                {isAdmin && (
                    <button
                        className={styles.createButton}
                        onClick={() => {/* TODO: Implement Create Course Modal */ }}
                    >
                        Create Course
                    </button>
                )}
            </div>
            <p className={styles.description}>
                List of all the courses available throughout the degree
                programme.
            </p>
            <br></br>
            <div className={styles.searchContainer}>
                <div>
                    <p className={styles.searchLabel}>Search</p>
                    <div className={styles["search-box"]}>
                        <img src="/icons/search.ico" alt="search icon" />
                        <input type="text" placeholder="Search for courses" />
                    </div>
                </div>
            </div>

            <div className={styles.grid}>
                {courses && courses.length > 0 ? (
                    courses.map((course) => (
                        <div key={course.id} className={styles.courseCard}>
                            <h3 className={styles.cardTitle}>{course.name}</h3>
                            <p className={styles.facultyName}>{course.faculty?.name || 'General'}</p>
                            <p className={styles.cardDesc}>{course.description}</p>
                            <div className={styles.cardFooter}>
                                <span className={styles.moduleCountBadge}>
                                    {course.modules_count || 0} Modules
                                </span>
                                <button className={styles.viewDetailsLink}>
                                    View Details →
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.noResults}>
                        No courses found. Start by creating one!
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
