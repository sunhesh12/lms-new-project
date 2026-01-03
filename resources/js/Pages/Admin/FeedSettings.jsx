import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import styles from '@/css/admin.module.css';

export default function FeedSettings({ settings }) {
    const { data, setData, put, processing, errors } = useForm({
        max_video_size_mb: settings.max_video_size_mb ?? 50,
        max_photo_size_mb: settings.max_photo_size_mb ?? 5,
        max_photos_per_post: settings.max_photos_per_post ?? 5,
        max_videos_per_post: settings.max_videos_per_post ?? 1,
        daily_post_limit: settings.daily_post_limit ?? 20,
        daily_status_limit: settings.daily_status_limit ?? 10,
        status_duration_minutes: settings.status_duration_minutes ?? 1440,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.feed-settings.update'));
    };

    return (
        <AuthenticatedLayout header={<h2 className={styles.pageHeader}>Feed Settings</h2>}>
            <Head title="Admin - Feed Settings" />

            <div style={{ padding: '1rem' }}>
                <form onSubmit={submit} className={styles.searchForm} style={{ maxWidth: 760 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', width: '100%' }}>
                        <div>
                            <label className={styles.sectionTitle}>Max video size (MB)</label>
                            <input type="number" className={styles.searchInput} value={data.max_video_size_mb} onChange={e => setData('max_video_size_mb', e.target.value)} />
                            {errors.max_video_size_mb && <div style={{ color: 'red' }}>{errors.max_video_size_mb}</div>}
                        </div>

                        <div>
                            <label className={styles.sectionTitle}>Max photo size (MB)</label>
                            <input type="number" className={styles.searchInput} value={data.max_photo_size_mb} onChange={e => setData('max_photo_size_mb', e.target.value)} />
                            {errors.max_photo_size_mb && <div style={{ color: 'red' }}>{errors.max_photo_size_mb}</div>}
                        </div>

                        <div>
                            <label className={styles.sectionTitle}>Max photos per post</label>
                            <input type="number" className={styles.searchInput} value={data.max_photos_per_post} onChange={e => setData('max_photos_per_post', e.target.value)} />
                            {errors.max_photos_per_post && <div style={{ color: 'red' }}>{errors.max_photos_per_post}</div>}
                        </div>

                        <div>
                            <label className={styles.sectionTitle}>Max videos per post</label>
                            <input type="number" className={styles.searchInput} value={data.max_videos_per_post} onChange={e => setData('max_videos_per_post', e.target.value)} />
                            {errors.max_videos_per_post && <div style={{ color: 'red' }}>{errors.max_videos_per_post}</div>}
                        </div>

                        <div>
                            <label className={styles.sectionTitle}>Daily post limit</label>
                            <input type="number" className={styles.searchInput} value={data.daily_post_limit} onChange={e => setData('daily_post_limit', e.target.value)} />
                            {errors.daily_post_limit && <div style={{ color: 'red' }}>{errors.daily_post_limit}</div>}
                        </div>

                        <div>
                            <label className={styles.sectionTitle}>Daily status limit</label>
                            <input type="number" className={styles.searchInput} value={data.daily_status_limit} onChange={e => setData('daily_status_limit', e.target.value)} />
                            {errors.daily_status_limit && <div style={{ color: 'red' }}>{errors.daily_status_limit}</div>}
                        </div>

                        <div>
                            <label className={styles.sectionTitle}>Status duration (minutes)</label>
                            <input type="number" className={styles.searchInput} value={data.status_duration_minutes} onChange={e => setData('status_duration_minutes', e.target.value)} />
                            {errors.status_duration_minutes && <div style={{ color: 'red' }}>{errors.status_duration_minutes}</div>}
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                        <button type="submit" className={styles.btnPrimary} disabled={processing}>Save</button>
                        <a href={route('admin.dashboard')} className={styles.btnSecondary}>Cancel</a>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
