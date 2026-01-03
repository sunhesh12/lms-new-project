import React, { useState, useEffect } from 'react';
import styles from '@/css/feed.module.css';

export default function StatusViewer({ statuses, onClose, currentUser }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // mark current as viewed by pinging the show route
        if (statuses && statuses[index]) {
            fetch(route('statuses.show', statuses[index].id), { credentials: 'same-origin' });
        }
    }, [index, statuses]);

    if (!statuses || statuses.length === 0) return null;

    const status = statuses[index];

    const next = () => setIndex(i => (i + 1) % statuses.length);
    const prev = () => setIndex(i => (i - 1 + statuses.length) % statuses.length);

    return (
        <div className={styles['modal-overlay']} style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <div className={styles['modal-content']} style={{ background: 'white', padding: '1rem', borderRadius: '8px', maxWidth: '720px', width: '95%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <img src={status.user.profile_pic ? `/storage/${status.user.profile_pic}` : `https://ui-avatars.com/api/?name=${status.user.name}`} alt={status.user.name} className={styles.avatar} />
                        <div>
                            <div style={{ fontWeight: 600 }}>{status.user.name}</div>
                            <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{new Date(status.created_at).toLocaleString()}</div>
                        </div>
                    </div>
                    <div>
                        <button onClick={onClose} className={styles['close-btn']}>Close</button>
                    </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                    {status.media_type === 'video' && status.media_path ? (
                        <video src={`/storage/${status.media_path}`} controls style={{ width: '100%', maxHeight: '480px' }} />
                    ) : status.media_path ? (
                        <img src={`/storage/${status.media_path}`} alt="status" style={{ width: '100%', maxHeight: '480px', objectFit: 'contain' }} />
                    ) : (
                        <p>{status.content}</p>
                    )}
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                    <button onClick={prev} className={styles['btn']}>Prev</button>
                    <div style={{ alignSelf: 'center' }}>{index + 1} / {statuses.length}</div>
                    <button onClick={next} className={styles['btn']}>Next</button>
                </div>
            </div>
        </div>
    );
}
