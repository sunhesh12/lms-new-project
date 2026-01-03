import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import styles from '@/css/admin.module.css';

export default function Statuses({ statuses, filters = {} }) {
    const handleDelete = (id) => {
        if (!confirm('Delete this status?')) return;
        router.delete(route('admin.statuses.destroy', id));
    };

    const [q, setQ] = useState(filters.q || '');
    const [fromDate, setFromDate] = useState(filters.from_date || '');
    const [fromTime, setFromTime] = useState(filters.from_time || '');
    const [toDate, setToDate] = useState(filters.to_date || '');
    const [toTime, setToTime] = useState(filters.to_time || '');

    const handleSearch = (e) => {
        e.preventDefault();
        const params = {};
        if (q) params.q = q;
        if (fromDate) params.from_date = fromDate;
        if (fromTime) params.from_time = fromTime;
        if (toDate) params.to_date = toDate;
        if (toTime) params.to_time = toTime;
        router.get(route('admin.statuses.index'), params, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setQ(''); setFromDate(''); setFromTime(''); setToDate(''); setToTime('');
        router.get(route('admin.statuses.index'));
    };

    const [modalOpen, setModalOpen] = useState(false);
    const [modalSrc, setModalSrc] = useState(null);

    const openMedia = (path, type) => {
        // path is storage path like 'statuses/abc.jpg'
        const url = path ? `/storage/${path}` : null;
        if (!url) return;
        setModalSrc({ url, type });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalSrc(null);
    };

    return (
        <AuthenticatedLayout header={<h2 className={styles.pageHeader}>Manage Statuses</h2>}>
            <Head title="Admin - Statuses" />
            <div style={{ padding: '1rem' }}>
                <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Link href={route('admin.dashboard')} className={styles.controlBtn}>Back to Dashboard</Link>
                    <Link href={route('admin.feed-settings.index')} className={styles.btnPrimary}>Feed Settings</Link>
                </div>

                <div>
                    <form onSubmit={handleSearch} className={styles.searchForm}>
                        <input type="text" className={styles.searchInput} placeholder="Search text or user" value={q} onChange={e => setQ(e.target.value)} />
                        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                            <input type="date" className={styles.dateInput} value={fromDate} onChange={e => setFromDate(e.target.value)} />
                            <input type="time" className={styles.timeInput} value={fromTime} onChange={e => setFromTime(e.target.value)} />
                        </div>
                        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                            <input type="date" className={styles.dateInput} value={toDate} onChange={e => setToDate(e.target.value)} />
                            <input type="time" className={styles.timeInput} value={toTime} onChange={e => setToTime(e.target.value)} />
                        </div>
                        <button type="submit" className={styles.btnPrimary}>Search</button>
                        <button type="button" onClick={handleReset} className={styles.btnSecondary}>Reset</button>
                    </form>
                    {statuses.data?.length === 0 && <div>No statuses found.</div>}
                    {statuses.data?.map(s => (
                        <div key={s.id} className={styles.userItem} style={{ justifyContent: 'space-between', gap: '1rem', marginBottom: '0.5rem' }}>
                            <div className={styles.statusInner}>
                                <img src={s.user?.profile_pic ? `/storage/${s.user.profile_pic}` : `https://ui-avatars.com/api/?name=${s.user?.name}`} className={styles.userAvatarSmall} alt="" />
                                        <div className={styles.statusMeta}>
                                            <div className={styles.statusUserName}>{s.user?.name}</div>
                                            <div className={styles.statusDate}>{new Date(s.created_at).toLocaleString()}</div>
                                            <div className={styles.statusContent}>{s.content}</div>
                                        </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <Link href={route('admin.users.edit', s.user.id)} className={styles.btnSecondary}>Manage User</Link>
                                {s.media_path && (
                                    <button type="button" onClick={() => openMedia(s.media_path, s.media_type)} className={styles.btnSecondary}>
                                        View Flyer
                                    </button>
                                )}
                                <button onClick={() => handleDelete(s.id)} className={styles.deleteBtn}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '1rem' }}>
                    {statuses.links?.length > 0 && (
                        <div className={styles.pagination} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {statuses.links.map((link, idx) => (
                                <span key={idx}>
                                    {link.url ? (
                                        <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    ) : (
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                {modalOpen && modalSrc && (
                    <div className={styles.modalOverlay} onClick={closeModal}>
                        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                            <button className={styles.modalClose} onClick={closeModal}>✕</button>
                            {modalSrc.type === 'video' ? (
                                <video className={styles.mediaVideo} controls>
                                    <source src={modalSrc.url} />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img src={modalSrc.url} alt="Flyer" className={styles.mediaPreview} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
