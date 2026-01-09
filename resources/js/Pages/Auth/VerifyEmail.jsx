import PrimaryButton from '@/components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import styles from '@/css/verifyEmail.module.css';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className={styles.pageContainer}>
                <div className={styles.card}>
                    <div className={styles.iconBox}>
                        <div className={styles.iconContainer}>
                            <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>

                    <div>
                        <h1 className={styles.title}>Verify your email</h1>
                        <p className={styles.description}>
                            Thanks for signing up! Before getting started, could you verify
                            your email address by clicking on the link we just emailed to
                            you?
                        </p>
                    </div>

                    {status === 'verification-link-sent' && (
                        <div className={styles.successMessage}>
                            A new verification link has been sent to your email address.
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div className={styles.actions}>
                            <PrimaryButton disabled={processing} className={styles.primaryBtn}>
                                Resend Verification Email
                            </PrimaryButton>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className={styles.logoutBtn}
                            >
                                Log Out
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
