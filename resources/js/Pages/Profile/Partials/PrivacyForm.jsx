import styles from '../css/profile.module.css';
import { useState } from 'react';
import { Eye, Shield, Users, Check } from 'lucide-react';
import PrimaryButton from '@/components/PrimaryButton';
import { Transition } from '@headlessui/react';

export default function PrivacyForm({ className = '' }) {
    const [privacy, setPrivacy] = useState({
        public_profile: true,
        show_email: false,
        share_activity: true
    });
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    const togglePrivacy = (key) => {
        setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        setRecentlySuccessful(true);
        setTimeout(() => setRecentlySuccessful(false), 2000);
    };

    return (
        <section className={className}>
            <header>
                <h2 className={styles.sectionTitle}>Privacy Settings</h2>
                <p className={styles.sectionSubtitle}>Control your account visibility and data sharing.</p>
            </header>

            <div className={styles.viewContainer} style={{ marginTop: '2rem' }}>
                <div className={styles.notificationItem}>
                    <div className={styles.notificationInfo}>
                        <Eye className={styles.notificationIcon} size={20} />
                        <div>
                            <span className={styles.dataLabel}>Public Profile</span>
                            <p className={styles.mutedText} style={{ fontSize: '0.8125rem' }}>Allow other students and lecturers to see your profile.</p>
                        </div>
                    </div>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={privacy.public_profile}
                            onChange={() => togglePrivacy('public_profile')}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>

                <div className={styles.notificationItem}>
                    <div className={styles.notificationInfo}>
                        <Shield className={styles.notificationIcon} size={20} />
                        <div>
                            <span className={styles.dataLabel}>Show Email Address</span>
                            <p className={styles.mutedText} style={{ fontSize: '0.8125rem' }}>Make your email visible to your connections.</p>
                        </div>
                    </div>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={privacy.show_email}
                            onChange={() => togglePrivacy('show_email')}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>

                <div className={styles.notificationItem}>
                    <div className={styles.notificationInfo}>
                        <Users className={styles.notificationIcon} size={20} />
                        <div>
                            <span className={styles.dataLabel}>Share Activity</span>
                            <p className={styles.mutedText} style={{ fontSize: '0.8125rem' }}>Show your active status and recent course progress.</p>
                        </div>
                    </div>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={privacy.share_activity}
                            onChange={() => togglePrivacy('share_activity')}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>

                <div className={styles.flexCenterGap4} style={{ marginTop: '1rem' }}>
                    <PrimaryButton onClick={handleSave} className={styles.saveButton}>
                        <Check size={18} className="mr-2" />
                        Update Privacy
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className={styles.successText}>Privacy updated!</p>
                    </Transition>
                </div>
            </div>
        </section>
    );
}
