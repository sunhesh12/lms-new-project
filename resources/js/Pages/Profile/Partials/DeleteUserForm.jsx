import DangerButton from '@/components/DangerButton';
import InputError from '@/components/Input/InputError';
import InputLabel from '@/components/Input/InputLabel';
import Modal from '@/components/Modal';
import SecondaryButton from '@/components/SecondaryButton';
import TextInput from '@/components/Input/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import styles from '../css/profile.module.css';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`${styles.spacingY6} ${className}`}>
            <header>
                <h2 className={styles.sectionTitle}>
                    Delete Account
                </h2>

                <p className={styles.sectionSubtitle}>
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. Before deleting your account,
                    please download any data or information that you wish to
                    retain.
                </p>
            </header>

            <DangerButton
                onClick={confirmUserDeletion}
                className={styles.deleteButton}
            >
                Delete Account
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className={styles.p6}>
                    <h2 className={styles.sectionTitle}>
                        Are you sure you want to delete your account?
                    </h2>

                    <p className={styles.sectionSubtitle}>
                        Once your account is deleted, all of its resources and
                        data will be permanently deleted. Please enter your
                        password to confirm you would like to permanently delete
                        your account.
                    </p>

                    <div className={styles.formGroup}>
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className={`${styles.mt1} ${styles.block}`}
                            isFocused
                            placeholder="Password"
                        />

                        <InputError
                            message={errors.password}
                            className={styles.inputError}
                        />
                    </div>

                    <div className={styles.actionWrapper}>
                        <SecondaryButton onClick={closeModal}>
                            Cancel
                        </SecondaryButton>

                        <DangerButton
                            className={styles.deleteButton}
                            disabled={processing}
                        >
                            Confirm Deletion
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
