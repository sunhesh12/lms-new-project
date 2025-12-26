import InputError from '@/components/Input/InputError';
import InputLabel from '@/components/Input/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/Input/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import styles from '../css/profile.module.css';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className={styles.sectionTitle}>
                    Profile Information
                </h2>

                <p className={styles.sectionSubtitle}>
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className={styles.formGroup}>
                <div className={styles.spacingY6}>
                    <div>
                        <InputLabel htmlFor="name" value="Name" />

                        <TextInput
                            id="name"
                            className={`${styles.mt1} ${styles.block} w-full`}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            isFocused
                            autoComplete="name"
                        />

                        <InputError className={styles.inputError} message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" />

                        <TextInput
                            id="email"
                            type="email"
                            className={`${styles.mt1} ${styles.block} w-full`}
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />

                        <InputError className={styles.inputError} message={errors.email} />
                    </div>

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div>
                            <p className={`${styles.mt1} ${styles.mutedText}`}>
                                Your email address is unverified.
                                <Link
                                    href={route('verification.send')}
                                    method="post"
                                    as="button"
                                    className={styles.link}
                                >
                                    Click here to re-send the verification email.
                                </Link>
                            </p>

                            {status === 'verification-link-sent' && (
                                <div className={`${styles.mt1} ${styles.successText}`}>
                                    A new verification link has been sent to your
                                    email address.
                                </div>
                            )}
                        </div>
                    )}

                    <div className={styles.flexCenterGap4}>
                        <PrimaryButton disabled={processing}>Save</PrimaryButton>

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
