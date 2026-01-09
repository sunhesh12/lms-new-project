import InputError from '@/components/Input/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import styles from '@/css/forgotPassword.module.css';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className={styles.pageContainer}>
                <div className={styles.card}>
                    <div className={styles.iconBox}>
                        <div className={styles.iconContainer}>
                            <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 9.636a1.003 1.003 0 00-.454-.242l-2.357-.614a2.36 2.36 0 00-.5.59l-.915 2.29a2.36 2.36 0 001.373 2.875l-1.076 1.077a2 2 0 002.324 2.324l1.078-1.076a2.36 2.36 0 002.874 1.373l2.29-.915a2.36 2.36 0 00.59-.5l.614-2.357a1.003 1.003 0 00-.242-.454l-1.921-1.921A6 6 0 0119 9a2 2 0 002-2z" />
                            </svg>
                        </div>
                    </div>

                    <div>
                        <h1 className={styles.title}>Forgot password?</h1>
                        <p className={styles.description}>
                            No problem. Just let us know your email address and we will
                            email you a password reset link that will allow you to choose a new one.
                        </p>
                    </div>

                    {status && (
                        <div className={styles.statusMessage}>
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>Email Address</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className={styles.input}
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="name@example.com"
                            />
                            <InputError message={errors.email} className={styles.errorMessage} />
                        </div>

                        <button className={styles.primaryBtn} disabled={processing}>
                            {processing ? 'Sending...' : 'Email Password Reset Link'}
                        </button>

                        <div className={styles.backLink}>
                            <Link href={route('login')} className={styles.link}>
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
