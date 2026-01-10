import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ChatSidebar from '@/Pages/Chat/Partials/ChatSidebar';
import ChatWindow from '@/Pages/Chat/Partials/ChatWindow';
import style from '@/css/chat.module.css';

export default function Index({ auth, conversations, activeConversation }) {
    const [selectedConversation, setSelectedConversation] = useState(activeConversation || null);
    const [onlineUsers, setOnlineUsers] = useState(new Set());

    useEffect(() => {
        setSelectedConversation(activeConversation);
    }, [activeConversation]);

    // Presence Channel Logic
    useEffect(() => {
        if (!window.Echo) return;

        console.log("Joining online channel..."); // Debug
        const channel = window.Echo.join('online')
            .here((users) => {
                const ids = new Set(users.map(u => u.id));
                setOnlineUsers(ids);
            })
            .joining((user) => {
                setOnlineUsers(prev => new Set(prev).add(user.id));
            })
            .leaving((user) => {
                setOnlineUsers(prev => {
                    const next = new Set(prev);
                    next.delete(user.id);
                    return next;
                });
            })
            .error((error) => {
                console.error('Presence channel error:', error);
            });

        return () => {
            window.Echo.leave('online');
        };
    }, []);

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
                            onlineUsers={onlineUsers}
                        />
                        <ChatWindow
                            user={auth.user}
                            conversation={selectedConversation}
                            onBack={() => setSelectedConversation(null)}
                            onlineUsers={onlineUsers}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
