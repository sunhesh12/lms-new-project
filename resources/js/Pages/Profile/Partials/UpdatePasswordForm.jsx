import InputError from '@/components/Input/InputError';
import InputLabel from '@/components/Input/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/Input/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import styles from '../css/profile.module.css';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className={styles.sectionTitle}>
                    Update Password
                </h2>

                <p className={styles.sectionSubtitle}>
                    Ensure your account is using a long, random password to stay
                    secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className={styles.formGroup}>
                <div className={styles.spacingY6}>
                    <div>
                        <InputLabel
                            htmlFor="current_password"
                            value="Current Password"
                        />

                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) =>
                                setData('current_password', e.target.value)
                            }
                            type="password"
                            className={`${styles.mt1} ${styles.block}`}
                            autoComplete="current-password"
                        />

                        <InputError
                            message={errors.current_password}
                            className={styles.inputError}
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="New Password" />

                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type="password"
                            className={`${styles.mt1} ${styles.block}`}
                            autoComplete="new-password"
                        />

                        <InputError message={errors.password} className={styles.inputError} />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm Password"
                        />

                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            type="password"
                            className={`${styles.mt1} ${styles.block}`}
                            autoComplete="new-password"
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className={styles.inputError}
                        />
                    </div>

                    <div className={styles.flexCenterGap4}>
                        <PrimaryButton
                            disabled={processing}
                            className={styles.saveButton}
                        >
                            Update Password
                        </PrimaryButton>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className={styles.mutedText}>
                                Saved.
                            </p>
                        </Transition>
                    </div>
                </div>
            </form>
        </section>
    );
}
