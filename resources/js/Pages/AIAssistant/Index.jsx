import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ChatWindow from '@/Pages/Chat/Partials/ChatWindow';
import { Sparkles, PlusCircle } from 'lucide-react';
import style from '@/css/aiAssistant.module.css';
import chatStyle from '@/css/chat.module.css';

export default function Index({ auth, conversation }) {
    const [providers, setProviders] = useState([]);
    const [selected, setSelected] = useState(auth.user?.ai_provider || null);
    const [ack, setAck] = useState(false);

    const TOP_PROVIDERS = [
        { identifier: 'openai', name: 'OpenAI (GPT)' },
        { identifier: 'gemini', name: 'Google Gemini' },
        { identifier: 'claude', name: 'Anthropic Claude' },
        { identifier: 'microsoft', name: 'Microsoft Azure OpenAI' },
        { identifier: 'cohere', name: 'Cohere' },
        { identifier: 'mistral', name: 'Mistral AI' },
        { identifier: 'stability', name: 'Stability AI' },
        { identifier: 'aleph', name: 'Aleph Alpha' },
        { identifier: 'baidu', name: 'Baidu Ernie' },
        { identifier: 'deepseek', name: 'DeepSeek' },
    ];

    useEffect(() => {
        // fetch enabled providers for selection
        (async () => {
            try {
                const res = await (await fetch('/admin/ai-providers/list')).json();
                // only include enabled admin providers and mark their source
                const admin = (res || [])
                    .filter(p => p.enabled)
                    .map(p => ({ identifier: p.identifier, name: p.name, id: p.id, source: 'admin' }));

                // Start with top providers, then append admin-only providers (avoid duplicates)
                const merged = TOP_PROVIDERS.map(p => ({ ...p, source: 'builtin' }));
                admin.forEach(a => {
                    const idx = merged.findIndex(m => m.identifier === a.identifier);
                    if (idx === -1) merged.push(a);
                    else merged[idx] = { ...merged[idx], ...a };
                });

                setProviders(merged);
            } catch (e) {
                console.error('Failed to load AI providers', e);
                setProviders(TOP_PROVIDERS.map(p => ({ ...p, source: 'builtin' })));
            }
        })();
    }, []);

    

    const savePreference = async (provider) => {
        try {
            await fetch('/ai-assistant/set-provider', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') },
                body: JSON.stringify({ ai_provider: provider }),
            });
            setSelected(provider);
            setAck(true);
            setTimeout(() => setAck(false), 2000);
        } catch (e) {
            console.error(e);
            setAck(true);
            setTimeout(() => setAck(false), 2000);
        }
    };
    const handleNewTopic = () => {
        // fallback: reload the page to start fresh topic via server
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

                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <div className={style.providerSelectWrapper}>
                            <select value={selected || ''} onChange={(e) => savePreference(e.target.value)} className={style.providerSelect}>
                                <option value="">Default</option>
                                {providers.map((p, idx) => (
                                    <option key={p.id || idx} value={p.identifier}>{p.name}{p.source === 'admin' ? ' (Admin)' : ''}</option>
                                ))}
                            </select>
                        </div>

                        <button className={style.newTopicBtn} onClick={handleNewTopic}>
                            <PlusCircle size={18} />
                            New Topic
                        </button>
                    </div>

                    <div className={`${style.aiToast} ${ack ? 'show' : ''}`} role="status">Preference saved</div>
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
