import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import CreatePost from './Components/CreatePost';
import PostCard from './Components/PostCard';
import styles from '@/css/feed.module.css';

export default function Feed({ auth, posts }) {
    console.log("Posts Data:", posts);
    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Campus Feed</h2>}>
            <Head title="Campus Feed" />

            <div className="py-12">
                <div className={`${styles['feed-container']} ${styles['space-y-6']}`}>
                    <CreatePost user={auth.user} />

                    <div className={styles['space-y-6']}>
                        {posts.data.map(post => (
                            <PostCard key={post.id} post={post} currentUser={auth.user} />
                        ))}
                    </div>

                    {/* Pagination could go here */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
