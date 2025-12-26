import { useForm, Head } from "@inertiajs/react";
import Button from "@/components/Input/Button";
import TextInput from "@/components/Input/TextInput";
import styles from "@/css/modules/join.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Join({ module }) {
    const { data, setData, post, processing, errors } = useForm({
        enrollment_key: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("module.enroll", { moduleId: module.id }));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Join ${module.name}`} />
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.imageContainer}>
                        <img
                            src={`/storage/uploads/modules/${module.cover_image_url}`}
                            alt={module.name}
                            className={styles.coverImage}
                        />
                        <div className={styles.overlay}></div>
                    </div>

                    <div className={styles.content}>
                        <h1 className={styles.title}>{module.name}</h1>
                        <p className={styles.description}>{module.description}</p>

                        <div className={styles.info}>
                            <span>Credits: {module.credit_value}</span>
                            <span>•</span>
                            <span>Lecturers: {module.lecturers.map(l => l.user.name).join(", ")}</span>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <FontAwesomeIcon icon={faLock} className={styles.icon} />
                                <TextInput
                                    type="password"
                                    placeholder="Enter Enrollment Key"
                                    value={data.enrollment_key}
                                    onChange={(e) => setData("enrollment_key", e.target.value)}
                                    error={errors.enrollment_key}
                                    className={styles.input}
                                />
                            </div>

                            <Button type="submit" disabled={processing} className={styles.submitBtn}>
                                Join Module <FontAwesomeIcon icon={faArrowRight} />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
