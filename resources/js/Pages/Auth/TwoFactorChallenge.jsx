import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import styles from './css/two-factor.module.css';

export default function TwoFactorChallenge({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('two-factor.store'));
    };

    return (
        <div className={styles.container}>
            <Head title="Two Factor Authentication" />

            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Two-Factor Authentication</h1>
                    <p className={styles.subtitle}>
                        Please enter the authentication code we sent to your email address.
                    </p>
                </div>

                {status && (
                    <div className="mb-4 font-medium text-sm text-green-600 text-center">
                        {status}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="code">
                            Authentication Code
                        </label>
                        <input
                            id="code"
                            type="text"
                            inputMode="numeric"
                            className={styles.input}
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            autoFocus
                        />
                        {errors.code && <div className={styles.error}>{errors.code}</div>}
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={processing}
                        >
                            {processing ? 'Verifying...' : 'Verify'}
                        </button>

                        <div className="text-center">
                            <span className="text-sm text-gray-500">Didn't receive code? </span>
                            <Link
                                href={route('two-factor.resend')}
                                className={styles.resendBtn}
                                style={{ display: 'inline', width: 'auto' }}
                            >
                                Resend Email
                            </Link>
                        </div>
                    </div>
                </form>

                <form method="POST" action={route('logout')} className="mt-4">
                    <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')} />
                    <button type="submit" className={styles.logoutLink} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}>
                        Logout
                    </button>
                </form>
            </div>
        </div>
    );
}
