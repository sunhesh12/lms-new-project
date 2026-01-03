import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Image, Video, Plus } from 'lucide-react';
import styles from '@/css/feed.module.css';

export default function CreateStatus({ user }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        content: '',
        media: null,
    });

    const [preview, setPreview] = useState(null);
    const [expanded, setExpanded] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        console.log('Submitting status', data);

        post(route('statuses.store'), {
            onStart: () => console.log('status post started'),
            onError: (errs) => {
                console.error('status post errors', errs);
                // optional: alert user
            },
            onSuccess: () => {
                console.log('status post success');
                reset();
                setPreview(null);
            },
            onFinish: () => console.log('status post finished'),
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('media', file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    return (
        <div className={`${styles['feed-card']} ${styles['card-padding']}`} style={{ width: expanded ? '320px' : '96px', minWidth: expanded ? '320px' : '96px', textAlign: 'center', transition: 'width 0.18s ease' }}>
            {!expanded ? (
                <div onClick={() => setExpanded(true)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.25rem' }}>
                        <Plus size={18} />
                    </div>
                    <div style={{ fontSize: '0.78rem' }}>Add Status</div>
                </div>
            ) : (
                <form onSubmit={submit}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <img src={user.profile_pic ? `/storage/${user.profile_pic}` : `https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} className={styles.avatar} style={{ width: '40px', height: '40px' }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <label className={styles['media-btn']} style={{ padding: '0.35rem' }}>
                                    <input type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={handleFileChange} />
                                    <Image size={16} />
                                </label>
                                <label className={styles['media-btn']} style={{ padding: '0.35rem' }}>
                                    <input type="file" accept="video/*" style={{ display: 'none' }} onChange={handleFileChange} />
                                    <Video size={16} />
                                </label>
                                <button type="button" onClick={() => { setExpanded(false); reset(); setPreview(null); }} className={styles['close-btn']} style={{ marginLeft: 'auto' }}>Close</button>
                            </div>

                            <div className={styles['post-input-container']} style={{ marginTop: '0.5rem' }}>
                                <textarea placeholder={`Share a quick status...`} value={data.content} onChange={e => setData('content', e.target.value)} className={styles.textarea} />
                            </div>

                            {preview && (
                                <div style={{ marginTop: '0.5rem' }}>
                                    {data.media?.type && data.media.type.startsWith('video') ? (
                                        <video src={preview} controls style={{ width: '100%', maxHeight: '160px', objectFit: 'cover' }} />
                                    ) : (
                                        <img src={preview} alt="preview" style={{ width: '100%', maxHeight: '160px', objectFit: 'cover' }} />
                                    )}
                                </div>
                            )}

                            <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                <button type="button" onClick={() => { setExpanded(false); reset(); setPreview(null); }} className={styles['btn']} style={{ background: '#9ca3af' }}>Cancel</button>
                                <button type="submit" disabled={processing || (!data.content && !data.media)} className={styles['submit-btn']}>Post</button>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}
