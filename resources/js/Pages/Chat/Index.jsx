import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ChatSidebar from './Partials/ChatSidebar';
import ChatWindow from './Partials/ChatWindow';

export default function Index({ auth, conversations, activeConversation }) {
    const [selectedConversation, setSelectedConversation] = useState(activeConversation || null);

    useEffect(() => {
        setSelectedConversation(activeConversation);
    }, [activeConversation]);

    return (
        <AuthenticatedLayout
            user={auth.user}
        // header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Chat</h2>}
        >
            <Head title="Chat" />

            <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto h-full">
                    <div className="bg-white/90 backdrop-blur-sm shadow-xl sm:rounded-2xl h-full flex overflow-hidden border border-white/20">
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
