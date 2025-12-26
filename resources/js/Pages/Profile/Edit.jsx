import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import styles from './css/profile-edit.module.css';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className={styles.pageHeader}>
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className={styles.container}>
                <div className={styles.innerContainer}>
                    <div className={styles.sectionCard}>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className={styles.maxWidthXl}
                        />
                    </div>

                    <div className={styles.sectionCard}>
                        <UpdatePasswordForm className={styles.maxWidthXl} />
                    </div>

                    <div className={styles.sectionCard}>
                        <DeleteUserForm className={styles.maxWidthXl} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
