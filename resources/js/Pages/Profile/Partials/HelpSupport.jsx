import styles from '../css/profile.module.css';
import { HelpCircle, Book, MessageCircle, Mail } from 'lucide-react';
import PrimaryButton from '@/components/PrimaryButton';

export default function HelpSupport({ className = '' }) {
    const supportLinks = [
        {
            title: 'Documentation',
            description: 'Learn how to use the LMS features effectively.',
            icon: Book,
            link: '#'
        },
        {
            title: 'Community Forums',
            description: 'Discuss topics with other students and lecturers.',
            icon: MessageCircle,
            link: '#'
        },
        {
            title: 'Contact Support',
            description: 'Get help with account or technical issues.',
            icon: Mail,
            link: 'mailto:support@lms.com'
        },
        {
            title: 'FAQ',
            description: 'Quick answers to commonly asked questions.',
            icon: HelpCircle,
            link: '#'
        }
    ];

    return (
        <section className={className}>
            <header>
                <h2 className={styles.sectionTitle}>Help & Support</h2>
                <p className={styles.sectionSubtitle}>Get assistance and learn more about the platform.</p>
            </header>

            <div className={styles.viewContainer} style={{ marginTop: '2rem' }}>
                <div className={styles.grid2}>
                    {supportLinks.map((item, index) => (
                        <div key={index} className={styles.supportCard}>
                            <item.icon className={styles.supportIcon} size={24} />
                            <div>
                                <h3 className={styles.dataLabel} style={{ fontSize: '0.875rem' }}>{item.title}</h3>
                                <p className={styles.mutedText} style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>{item.description}</p>
                                <a href={item.link} className={styles.link} style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: '0.875rem' }}>
                                    Visit
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.sectionCard} style={{ background: 'rgba(255, 255, 255, 0.5)', padding: '1.5rem', marginTop: '1rem' }}>
                    <h3 className={styles.dataLabel}>Need immediate help?</h3>
                    <p className={styles.mutedText} style={{ marginTop: '0.5rem' }}>
                        Our technical team is available Monday to Friday, 9:00 AM - 5:00 PM.
                    </p>
                    <PrimaryButton className={styles.saveButton} style={{ marginTop: '1rem' }} onClick={() => window.location.href = 'mailto:support@lms.com'}>
                        Email Support Team
                    </PrimaryButton>
                </div>
            </div>
        </section>
    );
}

