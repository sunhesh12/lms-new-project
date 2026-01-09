import React, { useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Camera } from 'lucide-react';
import styles from '../css/profile.module.css';
import { Transition } from '@headlessui/react';

export default function UpdateProfilePictureForm({ className = '' }) {
    const user = usePage().props.auth.user;
    const fileInput = useRef();

    const { data, setData, post, processing, recentlySuccessful, errors } = useForm({
        profile_pic: null,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('profile_pic', file);
            // Auto submit when file is selected
            const formData = new FormData();
            formData.append('profile_pic', file);

            // We use post because multipart/form-data doesn't work well with PATCH in PHP
            post(route('profile.update-picture'), {
                forceFormData: true,
            });
        }
    };

    const triggerFileInput = () => {
        fileInput.current.click();
    };

    return (
        <section className={className}>
            <header>
                <h2 className={styles.sectionTitle}>Profile Picture</h2>
                <p className={styles.sectionSubtitle}>Update your avatar to personalize your account.</p>
            </header>

            <div className={styles.profilePicSection}>
                <div className={styles.avatarWrapper} onClick={triggerFileInput}>
                    <img
                        src={user.avatar_url} // Always provided by backend fallback
                        alt={user.name}
                        className={styles.avatarLarge}
                    />
                    <div className={styles.uploadOverlay}>
                        <Camera size={32} />
                    </div>
                    <input
                        type="file"
                        ref={fileInput}
                        className={styles.fileInput}
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </div>

                {errors.profile_pic && (
                    <p className={styles.inputError} style={{ color: '#ef4444' }}>{errors.profile_pic}</p>
                )}

                <div className={styles.flexCenterGap4}>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className={styles.successText}>Avatar updated!</p>
                    </Transition>

                    {processing && <p className={styles.mutedText}>Uploading...</p>}
                </div>
            </div>
        </section>
    );
}
