import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import CreatePost from './Components/CreatePost';
import PostCard from './Components/PostCard';
import CreateStatus from './Components/CreateStatus';
import StatusViewer from './Components/StatusViewer';
import styles from '@/css/feed.module.css';

export default function Feed({ auth, posts, statuses }) {
    console.log("Posts Data:", posts);
    const [viewerState, setViewerState] = React.useState({ open: false, statuses: [], index: 0 });

    const openViewer = (userStatuses, startIndex = 0) => {
        setViewerState({ open: true, statuses: userStatuses, index: startIndex });
    };

    const closeViewer = () => setViewerState({ open: false, statuses: [], index: 0 });

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Campus Feed</h2>}>
            <Head title="Campus Feed" />

            <div className="py-12">
                <div className={`${styles['feed-container']} ${styles['space-y-6']}`}>
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto' }}>
                            <CreateStatus user={auth.user} />
                            {statuses && statuses.map((group, idx) => (
                                <div key={idx} onClick={() => openViewer(group.statuses)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                                    <img src={group.user.profile_pic ? `/storage/${group.user.profile_pic}` : `https://ui-avatars.com/api/?name=${group.user.name}`} alt={group.user.name} className={styles.avatar} />
                                    <div style={{ fontSize: '0.75rem' }}>{group.user.name.split(' ')[0]}</div>
                                    {group.unviewed_count > 0 && <div style={{ fontSize: '0.7rem', color: '#ef4444' }}>{group.unviewed_count}</div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <CreatePost user={auth.user} />

                    <div className={styles['space-y-6']}>
                        {posts.data.map(post => (
                            <PostCard key={post.id} post={post} currentUser={auth.user} />
                        ))}
                    </div>

                    {/* Pagination could go here */}
                </div>
                {viewerState.open && (
                    <StatusViewer statuses={viewerState.statuses} onClose={closeViewer} currentUser={auth.user} />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
