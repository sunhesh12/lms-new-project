import { useForm, Head } from "@inertiajs/react";
import Button from "@/components/Input/Button";
import TextInput from "@/components/Input/TextInput";
import styles from "@/css/modules/join.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faArrowRight, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Join({ module }) {
    const hasEnrollmentKey = module.enrollment_key && module.enrollment_key.trim() !== '';
    const { data, setData, post, processing, errors } = useForm({
        enrollment_key: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("module.enroll", { moduleId: module.id }));
    };

    const enrolledCount = module.students_count || 0;
    const capacity = module.maximum_students;
    const isFull = capacity > 0 && enrolledCount >= capacity;

    return (
        <AuthenticatedLayout>
            <Head title={`Join ${module.name}`} />
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.imageContainer}>
                        {module.cover_image_url && (
                            <img
                                src={`/storage/uploads/modules/${module.cover_image_url}`}
                                alt={module.name}
                                className={styles.coverImage}
                            />
                        )}
                        <div className={styles.overlay}></div>
                    </div>

                    <div className={styles.content}>
                        <h1 className={styles.title}>{module.name}</h1>
                        <p className={styles.description}>{module.description}</p>

                        <div className={styles.info}>
                            <span>Credits: {module.credit_value}</span>
                            <span>•</span>
                            <span>Lecturers: {module.lecturers?.map(l => l.user.name).join(", ") || 'N/A'}</span>
                        </div>

                        {capacity > 0 && (
                            <div className={styles.capacityInfo}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                <span>
                                    Enrollment: {enrolledCount}/{capacity} students
                                    {isFull && <strong style={{ color: 'var(--danger)', marginLeft: '5px' }}>(FULL)</strong>}
                                </span>
                            </div>
                        )}

                        {isFull ? (
                            <div className={styles.fullMessage}>
                                <p>This module has reached its maximum capacity.</p>
                                <p>Please contact the lecturer for more information.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className={styles.form}>
                                {hasEnrollmentKey ? (
                                    <>
                                        <div className={styles.inputGroup}>
                                            <FontAwesomeIcon icon={faLock} className={styles.icon} />
                                            <TextInput
                                                type="password"
                                                placeholder="Enter Enrollment Key"
                                                value={data.enrollment_key}
                                                onChange={(e) => setData("enrollment_key", e.target.value)}
                                                error={errors.enrollment_key}
                                                className={styles.input}
                                                required
                                            />
                                        </div>
                                        {errors.enrollment_key && (
                                            <p className={styles.error}>{errors.enrollment_key}</p>
                                        )}
                                    </>
                                ) : (
                                    <p className={styles.noKeyMessage}>
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                        No enrollment key required. Click below to join!
                                    </p>
                                )}

                                <Button type="submit" disabled={processing} className={styles.submitBtn}>
                                    {processing ? 'Enrolling...' : 'Join Module'} <FontAwesomeIcon icon={faArrowRight} />
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
