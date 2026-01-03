import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Image, Video, Send, X } from 'lucide-react';
import styles from '@/css/feed.module.css';

export default function CreatePost({ user }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        content: '',
        file: null,
    });
    const [preview, setPreview] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        post(route('feed.posts.store'), {
            onSuccess: () => {
                reset();
                setPreview(null);
            },
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('file', file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className={`${styles['feed-card']} ${styles['card-padding']}`}>
            <div className={styles['flex-row']}>
                <img
                    src={user.profile_pic ? `/storage/${user.profile_pic}` : "https://ui-avatars.com/api/?name=" + user.name}
                    alt={user.name}
                    className={styles.avatar}
                />
                <div className={styles['flex-1']}>
                    <form onSubmit={submit}>
                        <div className={styles['post-input-container']}>
                            <textarea
                                placeholder={`What's on your mind, ${user.name.split(' ')[0]}?`}
                                value={data.content}
                                onChange={e => setData('content', e.target.value)}
                                className={styles.textarea}
                            />
                        </div>

                        {preview && (
                            <div className={styles['preview-box']}>
                                {data.file?.type.startsWith('video') ? (
                                    <video src={preview} controls className={`${styles['w-full']} ${styles['max-h-60']} ${styles['object-contain']}`} />
                                ) : (
                                    <img src={preview} alt="Preview" className={`${styles['w-full']} ${styles['max-h-60']} ${styles['object-contain']}`} />
                                )}
                                <button
                                    type="button"
                                    onClick={() => { setData('file', null); setPreview(null); }}
                                    className={styles['preview-close']}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        <div className={styles['post-actions']}>
                            <div className={styles['media-btn-group']}>
                                <label className={styles['media-btn']}>
                                    <input type="file" className={styles.hidden} accept="image/*" onChange={handleFileChange} />
                                    <Image size={20} color="#10b981" />
                                </label>
                                <label className={styles['media-btn']}>
                                    <input type="file" className={styles.hidden} accept="video/*" onChange={handleFileChange} />
                                    <Video size={20} color="#f43f5e" />
                                </label>
                            </div>
                            <button
                                type="submit"
                                disabled={processing || (!data.content && !data.file)}
                                className={styles['submit-btn']}
                            >
                                <Send size={16} />
                                Post
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
