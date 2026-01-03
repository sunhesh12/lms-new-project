import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react'; // Import Link
import { MessageSquare, Heart, Share2, MoreHorizontal, Trash2 } from 'lucide-react';
import CommentSection from './CommentSection';
import styles from '@/css/feed.module.css';

export default function PostCard({ post, currentUser }) {
    const { post: submitReaction } = useForm();
    const { delete: deletePost } = useForm();
    const { data: shareData, setData: setShareData, post: submitShare, reset: resetShare, processing: processingShare } = useForm({
        content: ''
    });

    const [showComments, setShowComments] = useState(false);
    const [showShareInput, setShowShareInput] = useState(false);

    const toggleReaction = () => {
        submitReaction(route('feed.posts.react', post.id), {
            preserveScroll: true,
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this post?')) {
            deletePost(route('feed.posts.destroy', post.id));
        }
    };

    const handleShare = (e) => {
        e.preventDefault();
        submitShare(route('feed.posts.share', post.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowShareInput(false);
                resetShare();
            }
        });
    };

    const isShared = post.type === 'shared' && post.parent;

    return (
        <div className={`${styles['feed-card']} ${styles['card-padding']} ${styles['mb-6']}`}>
            {/* Header */}
            <div className={styles['card-header']}>
                <div className={styles['user-info']}>
                    <img
                        src={post.user.profile_pic ? `/storage/${post.user.profile_pic}` : "https://ui-avatars.com/api/?name=" + post.user.name}
                        alt={post.user.name}
                        className={styles.avatar}
                    />
                    <div>
                        <h4 className={styles['user-name']}>{post.user.name}</h4>
                        <span className={styles['post-time']}>{new Date(post.created_at).toLocaleString()}</span>
                    </div>
                </div>
                {(currentUser.id === post.user_id || currentUser.role === 'admin') && (
                    <button onClick={handleDelete} className={styles['delete-btn']}>
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className={styles['post-content']}>
                <p className={styles['post-text']}>{post.content}</p>

                {/* Attachments */}
                {post.attachments && post.attachments.length > 0 && (
                    <div className={`${styles['rounded-lg']} ${styles['overflow-hidden']} ${styles['w-full']}`}>
                        {post.attachments.map(att => (
                            <div key={att.id}>
                                {att.file_type === 'video' ? (
                                    <video src={`/storage/${att.file_path}`} controls className={styles['w-full']} style={{ maxHeight: '500px', backgroundColor: 'black' }} />
                                ) : (
                                    <img src={`/storage/${att.file_path}`} alt="Post attachment" className={styles['w-full']} style={{ objectFit: 'cover', maxHeight: '500px' }} />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Shared Content */}
                {isShared && (
                    <div className={styles['shared-post']}>
                        <div className={styles['user-info']} style={{ marginBottom: '0.5rem', alignItems: 'center' }}>
                            <img
                                src={post.parent.user.profile_pic ? `/storage/${post.parent.user.profile_pic}` : "https://ui-avatars.com/api/?name=" + post.parent.user.name}
                                alt={post.parent.user.name}
                                className={styles['avatar-small']}
                            />
                            <span className={styles['user-name']} style={{ fontSize: '0.875rem' }}>{post.parent.user.name}</span>
                            <span className={styles['post-time']} style={{ fontSize: '0.75rem' }}>{new Date(post.parent.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className={styles['post-text']} style={{ fontSize: '0.875rem' }}>{post.parent.content}</p>
                        {post.parent.attachments && post.parent.attachments.length > 0 && (
                            <div className={`${styles['rounded-lg']} ${styles['overflow-hidden']}`} style={{ marginTop: '0.5rem', height: '8rem', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Media Attachment</div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className={styles['post-stats']}>
                <div className={styles['flex-row']} style={{ gap: '0.25rem' }}>
                    {post.reactions_count > 0 && (
                        <>
                            <div style={{ backgroundColor: '#ef4444', borderRadius: '50%', padding: '0.25rem', display: 'flex' }}><Heart size={10} color="white" fill="white" /></div>
                            <span>{post.reactions_count}</span>
                        </>
                    )}
                </div>
                <div>
                    <span>{post.comments_count} comments</span>
                </div>
            </div>

            {/* Actions */}
            <div className={styles['action-bar']}>
                <button
                    onClick={toggleReaction}
                    className={`${styles['action-btn']} ${post.is_liked ? styles.liked : ''} ${styles['reaction-btn']}`}
                >
                    <Heart size={20} className={post.is_liked ? "fill-current" : ""} />
                    <span className="font-medium">Like</span>
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className={styles['action-btn']}
                >
                    <MessageSquare size={20} />
                    <span className="font-medium">Comment</span>
                </button>
                <button
                    onClick={() => setShowShareInput(!showShareInput)}
                    className={styles['action-btn']}
                >
                    <Share2 size={20} />
                    <span className="font-medium">Share</span>
                </button>
            </div>

            {/* Share Input */}
            {showShareInput && (
                <form onSubmit={handleShare} className={styles['share-form']}>
                    <input
                        type="text"
                        placeholder="Say something about this..."
                        className={styles['share-input']}
                        value={shareData.content}
                        onChange={e => setShareData('content', e.target.value)}
                        autoFocus
                    />
                    <div className={styles['share-footer']}>
                        <button
                            type="submit"
                            disabled={processingShare}
                            className={styles['share-submit']}
                        >
                            Share Now
                        </button>
                    </div>
                </form>
            )}

            {/* Comments Section */}
            {showComments && <CommentSection post={post} currentUser={currentUser} />}
        </div>
    );
}
