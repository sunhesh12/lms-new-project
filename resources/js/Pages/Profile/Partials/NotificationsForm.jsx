import styles from '../css/profile.module.css';
import { useState } from 'react';
import { Bell, Mail, Smartphone, Check } from 'lucide-react';
import PrimaryButton from '@/components/PrimaryButton';
import { Transition } from '@headlessui/react';

export default function NotificationsForm({ className = '' }) {
    const [notifications, setNotifications] = useState({
        email_updates: true,
        system_alerts: true,
        marketing: false,
        browser_notifications: true
    });
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        setRecentlySuccessful(true);
        setTimeout(() => setRecentlySuccessful(false), 2000);
    };

    return (
        <section className={className}>
            <header>
                <h2 className={styles.sectionTitle}>Notifications</h2>
                <p className={styles.sectionSubtitle}>Manage how you receive alerts and updates.</p>
            </header>

            <div className={styles.viewContainer} style={{ marginTop: '2rem' }}>
                <div className={styles.notificationItem}>
                    <div className={styles.notificationInfo}>
                        <Mail className={styles.notificationIcon} size={20} />
                        <div>
                            <span className={styles.dataLabel}>Email Updates</span>
                            <p className={styles.mutedText} style={{ fontSize: '0.8125rem' }}>Get important account activity sent to your email.</p>
                        </div>
                    </div>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={notifications.email_updates}
                            onChange={() => toggleNotification('email_updates')}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>

                <div className={styles.notificationItem}>
                    <div className={styles.notificationInfo}>
                        <Bell className={styles.notificationIcon} size={20} />
                        <div>
                            <span className={styles.dataLabel}>System Alerts</span>
                            <p className={styles.mutedText} style={{ fontSize: '0.8125rem' }}>In-app notifications for course updates and forum activity.</p>
                        </div>
                    </div>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={notifications.system_alerts}
                            onChange={() => toggleNotification('system_alerts')}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>

                <div className={styles.notificationItem}>
                    <div className={styles.notificationInfo}>
                        <Smartphone className={styles.notificationIcon} size={20} />
                        <div>
                            <span className={styles.dataLabel}>Browser Notifications</span>
                            <p className={styles.mutedText} style={{ fontSize: '0.8125rem' }}>Real-time push notifications from your browser.</p>
                        </div>
                    </div>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={notifications.browser_notifications}
                            onChange={() => toggleNotification('browser_notifications')}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>

                <div className={styles.flexCenterGap4} style={{ marginTop: '1rem' }}>
                    <PrimaryButton onClick={handleSave} className={styles.saveButton}>
                        <Check size={18} className="mr-2" />
                        Save Preferences
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className={styles.successText}>Preferences saved!</p>
                    </Transition>
                </div>
            </div>
        </section>
    );
}
