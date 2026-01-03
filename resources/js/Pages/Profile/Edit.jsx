import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    User,
    Lock,
    Bell,
    Shield,
    HelpCircle,
    Trash2
} from 'lucide-react';

import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateProfilePictureForm from './Partials/UpdateProfilePictureForm';
import NotificationsForm from './Partials/NotificationsForm';
import PrivacyForm from './Partials/PrivacyForm';
import HelpSupport from './Partials/HelpSupport';

import styles from './css/profile-edit.module.css';

export default function Edit({ mustVerifyEmail, status }) {
    // Initialize tab from URL query param if present
    const queryParams = new URLSearchParams(window.location.search);
    const initialTab = queryParams.get('tab') || 'profile';
    const [activeTab, setActiveTab] = useState(initialTab);

    // Sync tab state with URL changes
    useEffect(() => {
        const handleLocationChange = () => {
            const params = new URLSearchParams(window.location.search);
            const tab = params.get('tab');
            if (tab && tab !== activeTab) {
                setActiveTab(tab);
            }
        };

        window.addEventListener('popstate', handleLocationChange);
        return () => window.removeEventListener('popstate', handleLocationChange);
    }, [activeTab]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        // Update URL without full page reload
        const url = new URL(window.location);
        url.searchParams.set('tab', tabId);
        window.history.pushState({}, '', url);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy', icon: Shield },
        { id: 'help', label: 'Help & Support', icon: HelpCircle },
        { id: 'danger', label: 'Danger Zone', icon: Trash2 },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className={styles.sectionCard}>
                        <div className={styles.grid2}>
                            <UpdateProfilePictureForm />
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className={styles.sectionCard}>
                        <UpdatePasswordForm className={styles.maxWidthXl} />
                    </div>
                );
            case 'notifications':
                return (
                    <div className={styles.sectionCard}>
                        <NotificationsForm className={styles.maxWidthXl} />
                    </div>
                );
            case 'privacy':
                return (
                    <div className={styles.sectionCard}>
                        <PrivacyForm className={styles.maxWidthXl} />
                    </div>
                );
            case 'help':
                return (
                    <div className={styles.sectionCard}>
                        <HelpSupport />
                    </div>
                );
            case 'danger':
                return (
                    <div className={styles.sectionCard}>
                        <DeleteUserForm className={styles.maxWidthXl} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className={styles.pageHeader}>
                    Settings & Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className={styles.container}>
                <div className={styles.innerContainer}>
                    {/* Sidebar Navigation */}
                    <aside className={styles.sidebar}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ''}`}
                            >
                                <tab.icon className={styles.icon} size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </aside>

                    {/* Content Area */}
                    <main className={styles.contentArea}>
                        {renderContent()}
                    </main>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
