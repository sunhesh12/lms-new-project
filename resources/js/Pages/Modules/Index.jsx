import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { BookOpen, AlertCircle, ArrowRight, Star, Plus, UserPlus } from "lucide-react";
import styles from "@/css/modules.module.css";

export default function Index({ modules, enrolled_modules, available_modules }) {
    const { auth } = usePage().props;
    const isControlUser = auth.user?.role === 'admin' || auth.user?.role === 'lecturer';
    const isStudent = auth.user?.role === 'student';

    const displayModules = modules || enrolled_modules;

    const handleJoin = (moduleId) => {
        router.post(route('module.enroll', moduleId), {}, {
            onSuccess: () => alert("Enrolled successfully!")
        });
    };

    const ModuleCard = ({ module, isEnrolled }) => (
        <div className={styles.card}>
            {/* Cover Image Section */}
            <div className={styles.imageSection}>
                <div className={styles.imageOverlay} />
                {module.cover_image_url ? (
                    <img
                        src={`/storage/uploads/modules/${module.cover_image_url}`}
                        alt={module.name}
                        className={styles.image}
                    />
                ) : (
                    <div className={styles.placeholderImage}>
                        <BookOpen size={48} className={styles.placeholderIcon} />
                    </div>
                )}

                <div className={styles.badgeContainer}>
                    <div className={styles.newBadge}>
                        <Star size={14} className={styles.starIcon} />
                        <span>New</span>
                    </div>
                </div>

                <div className={styles.creditBadge}>
                    {module.credit_value} Credits
                </div>
            </div>

            {/* Content Section */}
            <div className={styles.content}>
                <h3 className={styles.cardTitle}>
                    {module.name}
                </h3>
                <p className={styles.cardDesc}>
                    {module.description}
                </p>

                <div className={styles.cardFooter}>
                    {isEnrolled ? (
                        <Link
                            href={route('module.show', module.id)}
                            className={styles.footerAction}
                        >
                            <span>Enter Learning Space</span>
                            <ArrowRight size={16} className={styles.arrowIcon} />
                        </Link>
                    ) : (
                        <button
                            onClick={() => handleJoin(module.id)}
                            className={styles.footerAction}
                            style={{ color: '#2563eb' }}
                        >
                            <span>Join Module</span>
                            <UserPlus size={16} className={styles.arrowIcon} />
                        </button>
                    )}
                </div>
            </div>

            {/* Glow Effect at bottom */}
            <div className={styles.bottomGlow} />
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        My Learning
                    </h2>
                    {isControlUser && (
                        <button
                            className={styles.headerAction}
                            onClick={() => {/* TODO: Implement Create Module Modal */ }}
                        >
                            <Plus size={18} className="inline mr-1" />
                            Create Module
                        </button>
                    )}
                </div>
            }
        >
            <Head title="My Modules" />

            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>
                        {isStudent ? "My Modules" : "All Modules"}
                    </h1>
                    <p className={styles.subtitle}>
                        {isStudent
                            ? "Continue your educational journey and track your progress."
                            : "Manage system modules and academic content."}
                    </p>
                </header>

                {displayModules && displayModules.length > 0 ? (
                    <div className={styles.grid}>
                        {displayModules.map((module) => (
                            <ModuleCard key={module.id} module={module} isEnrolled={true} />
                        ))}
                    </div>
                ) : !isStudent && (
                    <div className={styles.emptyState}>
                        <p className={styles.emptySubtitle}>No modules found.</p>
                    </div>
                )}

                {isStudent && available_modules && available_modules.length > 0 && (
                    <>
                        <header className={styles.header} style={{ marginTop: '4rem' }}>
                            <h2 className={styles.title}>Available Modules</h2>
                            <p className={styles.subtitle}>Explore and enroll in new learning opportunities.</p>
                        </header>
                        <div className={styles.grid}>
                            {available_modules.map((module) => (
                                <ModuleCard key={module.id} module={module} isEnrolled={false} />
                            ))}
                        </div>
                    </>
                )}

                {isStudent && displayModules?.length === 0 && available_modules?.length === 0 && (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIconContainer}>
                            <AlertCircle size={40} className={styles.emptyIcon} />
                        </div>
                        <h3 className={styles.emptyTitle}>No Modules Available</h3>
                        <p className={styles.emptySubtitle}>
                            There are currently no modules assigned to you or available for enrollment.
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
