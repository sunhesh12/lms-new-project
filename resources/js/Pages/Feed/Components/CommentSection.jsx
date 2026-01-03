import React from 'react';
import { useForm } from '@inertiajs/react'; // Import Link if needed
import { Send, Trash2 } from 'lucide-react';
import styles from '@/css/feed.module.css';

export default function CommentSection({ post, currentUser }) {
    const { data, setData, post: submitComment, processing, reset } = useForm({
        content: '',
        parent_id: null
    });

    const { delete: deleteComment } = useForm();

    const handleSubmit = (e) => {
        e.preventDefault();
        submitComment(route('feed.comments.store', post.id), {
            preserveScroll: true,
            onSuccess: () => reset()
        });
    };

    const handleDelete = (commentId) => {
        if (confirm('Delete this comment?')) {
            deleteComment(route('feed.comments.destroy', commentId), {
                preserveScroll: true
            });
        }
    };

    return (
        <div className={styles['comment-section']}>
            {/* Comment Input */}
            <form onSubmit={handleSubmit} className={styles['comment-input-area']}>
                <img
                    src={currentUser.profile_pic ? `/storage/${currentUser.profile_pic}` : "https://ui-avatars.com/api/?name=" + currentUser.name}
                    alt={currentUser.name}
                    className={styles['avatar-small']}
                />
                <div className={styles['comment-input-wrapper']}>
                    <input
                        type="text"
                        placeholder="Write a comment..."
                        className={styles['comment-input']}
                        value={data.content}
                        onChange={e => setData('content', e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={!data.content || processing}
                        className={styles['comment-submit']}
                    >
                        <Send size={16} />
                    </button>
                </div>
            </form>

            {/* Comments List */}
            <div className={styles['comment-list']}>
                {post.comments && post.comments.map(comment => (
                    <div key={comment.id} className={styles['comment-item']}>
                        <img
                            src={comment.user.profile_pic ? `/storage/${comment.user.profile_pic}` : "https://ui-avatars.com/api/?name=" + comment.user.name}
                            alt={comment.user.name}
                            className={styles['avatar-small']}
                        />
                        <div className={styles['flex-1']}>
                            <div className={styles['comment-bubble']}>
                                <span className={styles['comment-author']}>{comment.user.name}</span>
                                <p className={styles['comment-text']}>{comment.content}</p>
                            </div>
                            <div className={styles['comment-meta']}>
                                <span>{new Date(comment.created_at).toLocaleString()}</span>
                                {(currentUser.id === comment.user_id || currentUser.role === 'admin') && (
                                    <button onClick={() => handleDelete(comment.id)} className={styles['comment-delete']}>Delete</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
