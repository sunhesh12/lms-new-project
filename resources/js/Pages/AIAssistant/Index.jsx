import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ChatWindow from '@/Pages/Chat/Partials/ChatWindow';
import { Sparkles, PlusCircle } from 'lucide-react';
import style from '@/css/aiAssistant.module.css';

export default function Index({ auth, conversation }) {
    const handleNewTopic = () => {
        // Implementation for clearing context or starting fresh if desired
        window.location.reload();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Academic AI Assistant</h2>}
        >
            <Head title="AI Assistant" />

            <div className={style.wrapper}>
                <div className={style.immersiveBackground}>
                    <div className={style.glow} style={{ top: '10%', right: '10%' }}></div>
                    <div className={style.glow} style={{ bottom: '20%', left: '5%' }}></div>
                </div>

                <div className={style.header}>
                    <div className={style.aiBrand}>
                        <div className={style.aiIconWrapper}>
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h2>Academic Assistant</h2>
                            <span>AI Powered</span>
                        </div>
                    </div>

                    <button className={style.newTopicBtn} onClick={handleNewTopic}>
                        <PlusCircle size={18} />
                        New Topic
                    </button>
                </div>

                <div className={style.mainArea}>
                    <div className={style.chatContainer}>
                        <ChatWindow
                            user={auth.user}
                            conversation={conversation}
                            onBack={() => window.history.back()}
                            isStandalone={true}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
