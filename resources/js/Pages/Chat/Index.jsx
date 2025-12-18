import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ChatSidebar from '@/Pages/Chat/Partials/ChatSidebar';
import ChatWindow from '@/Pages/Chat/Partials/ChatWindow';
import style from '@/css/chat.module.css';

export default function Index({ auth, conversations, activeConversation }) {
    const [selectedConversation, setSelectedConversation] = useState(activeConversation || null);

    useEffect(() => {
        setSelectedConversation(activeConversation);
    }, [activeConversation]);

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Chat" />

            <div className={style.page_wrapper}>
                <div className={style.container}>
                    <div className={`${style.card} ${selectedConversation ? style.showWindow : style.showSidebar}`}>
                        <ChatSidebar
                            auth={auth}
                            conversations={conversations}
                            selectedConversation={selectedConversation}
                            setSelectedConversation={setSelectedConversation}
                        />
                        <ChatWindow
                            user={auth.user}
                            conversation={selectedConversation}
                            onBack={() => setSelectedConversation(null)}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
