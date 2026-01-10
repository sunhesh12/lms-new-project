import InputError from '@/components/Input/InputError';
import InputLabel from '@/components/Input/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/Input/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Edit2, X, Check } from 'lucide-react';
import styles from '../css/profile.module.css';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, patch, errors, processing, recentlySuccessful, reset } =
        useForm({
            name: user.name,
            email: user.email,
            address: user.address || '',
            user_phone_no: user.user_phone_no || '',
            user_dob: user.user_dob || '',
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            onSuccess: () => setIsEditing(false),
        });
    };

    const cancelEdit = () => {
        reset();
        setIsEditing(false);
    };

    return (
        <section className={className}>
            <header className={styles.headerActions}>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className={styles.editToggleBtn}
                    >
                        <Edit2 size={16} />
                        Edit Profile
                    </button>
                ) : (
                    <button
                        onClick={cancelEdit}
                        className={styles.editToggleBtn}
                    >
                        <X size={16} />
                        Cancel
                    </button>
                )
                }
            </header>

            {!isEditing ? (
                <div className={styles.viewContainer}>
                    <div className={styles.dataGroup}>
                        <span className={styles.dataLabel}>Full Name</span>
                        <span className={styles.dataValue}>{user.name}</span>
                    </div>

                    <div className={styles.dataGroup}>
                        <span className={styles.dataLabel}>Email Address</span>
                        <span className={styles.dataValue}>{user.email}</span>
                    </div>

                    <div className={styles.dataGroup}>
                        <span className={styles.dataLabel}>Address</span>
                        <span className={styles.dataValue}>{user.address || 'Not provided'}</span>
                    </div>

                    <div className={styles.grid2}>
                        <div className={styles.dataGroup}>
                            <span className={styles.dataLabel}>Phone Number</span>
                            <span className={styles.dataValue}>{user.user_phone_no || 'Not provided'}</span>
                        </div>

                        <div className={styles.dataGroup}>
                            <span className={styles.dataLabel}>Date of Birth</span>
                            <span className={styles.dataValue}>{user.user_dob || 'Not provided'}</span>
                        </div>
                    </div>

                    <div className={styles.grid2}>
                        <div className={styles.dataGroup}>
                            <span className={styles.dataLabel}>Index Number</span>
                            <span className={styles.dataValue}>{user.index_number || 'Not provided'}</span>
                        </div>

                        <div className={styles.dataGroup}>
                            <span className={styles.dataLabel}>Registration Number</span>
                            <span className={styles.dataValue}>{user.registration_number || 'Not provided'}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <form onSubmit={submit} className={styles.formGroup}>
                    <div className={styles.spacingY6}>
                        <div>
                            <TextInput
                                id="name"
                                label="Full Name"
                                className={`${styles.mt1} ${styles.block}`}
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                isFocused
                                autoComplete="name"
                                error={errors.name}
                            />
                        </div>

                        <div>
                            <TextInput
                                id="email"
                                label="Email Address"
                                type="email"
                                className={`${styles.mt1} ${styles.block}`}
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                error={errors.email}
                            />
                        </div>

                        <div>
                            <TextInput
                                id="address"
                                label="Address"
                                className={`${styles.mt1} ${styles.block}`}
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                autoComplete="street-address"
                                error={errors.address}
                            />
                        </div>

                        <div className={styles.grid2}>
                            <div>
                                <TextInput
                                    id="user_phone_no"
                                    label="Phone Number"
                                    className={`${styles.mt1} ${styles.block}`}
                                    value={data.user_phone_no}
                                    onChange={(e) => setData('user_phone_no', e.target.value)}
                                    autoComplete="tel"
                                    error={errors.user_phone_no}
                                />
                            </div>

                            <div>
                                <TextInput
                                    id="user_dob"
                                    label="Date of Birth"
                                    type="date"
                                    className={`${styles.mt1} ${styles.block}`}
                                    value={data.user_dob}
                                    onChange={(e) => setData('user_dob', e.target.value)}
                                    error={errors.user_dob}
                                />
                            </div>
                        </div>

                        {/* Read-only fields - shown in both view and edit modes */}
                        <div className={styles.grid2}>
                            <div className={styles.dataGroup}>
                                <span className={styles.dataLabel}>Index Number</span>
                                <span className={styles.dataValue}>{user.index_number || 'Not provided'}</span>
                            </div>

                            <div className={styles.dataGroup}>
                                <span className={styles.dataLabel}>Registration Number</span>
                                <span className={styles.dataValue}>{user.registration_number || 'Not provided'}</span>
                            </div>
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
                            <PrimaryButton
                                disabled={processing}
                                className={styles.saveButton}
                            >
                                <Check size={18} className="mr-2" />
                                Save Changes
                            </PrimaryButton>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className={styles.mutedText}>
                                    Saved successfully.
                                </p>
                            </Transition>
                        </div>
                    </div>
                </form>
            )}
        </section>
    );
}
