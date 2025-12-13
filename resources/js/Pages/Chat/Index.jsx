import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ChatSidebar from './Partials/ChatSidebar';
import ChatWindow from './Partials/ChatWindow';

import styles from '@/css/chat.module.css';

export default function Index({ auth, conversations, activeConversation }) {
    const [selectedConversation, setSelectedConversation] = useState(activeConversation || null);

    useEffect(() => {
        setSelectedConversation(activeConversation);
    }, [activeConversation]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Chat" />

            <div className={styles.chatPage}>
                <div className={styles.chatContainer}>
                    <div className={styles.chatCard}>
                        <ChatSidebar
                            conversations={conversations}
                            selectedConversation={selectedConversation}
                            setSelectedConversation={setSelectedConversation}
                        />
                        <ChatWindow
                            user={auth.user}
                            conversation={selectedConversation}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
