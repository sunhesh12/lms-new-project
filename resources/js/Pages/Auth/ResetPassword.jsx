import InputError from '@/components/Input/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import styles from '@/css/forgotPassword.module.css';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <div className={styles.pageContainer}>
                <div className={styles.card}>
                    <div className={styles.iconBox}>
                        <div className={styles.iconContainer}>
                            <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>

                    <div>
                        <h1 className={styles.title}>Reset Password</h1>
                        <p className={styles.description}>
                            Please create a new secure password for your account.
                        </p>
                    </div>

                    <form onSubmit={submit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>Email Address</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className={styles.input}
                                readOnly
                            />
                            <InputError message={errors.email} className={styles.errorMessage} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password" className={styles.label}>New Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className={styles.input}
                                autoFocus
                                required
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Enter new password"
                            />
                            <InputError message={errors.password} className={styles.errorMessage} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password_confirmation" className={styles.label}>Confirm Password</label>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className={styles.input}
                                required
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Confirm new password"
                            />
                            <InputError message={errors.password_confirmation} className={styles.errorMessage} />
                        </div>

                        <button className={styles.primaryBtn} disabled={processing}>
                            {processing ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
