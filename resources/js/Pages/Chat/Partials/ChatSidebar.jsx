import { Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CreateGroupModal from './CreateGroupModal';
import styles from '@/css/chatSidebar.module.css';

export default function ChatSidebar({ conversations, selectedConversation }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [localConversations, setLocalConversations] = useState(conversations);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.trim()) {
                setIsSearching(true);
                axios.get(route('users.search'), { params: { query: searchQuery } })
                    .then(res => {
                        setSearchResults(res.data);
                        setIsSearching(false);
                    })
                    .catch(() => setIsSearching(false));
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    const startChat = (userId) => {
        axios.post(route('conversations.check'), { user_id: userId })
            .then(res => {
                router.visit(route('chat.show', res.data.conversation_id));
                setSearchQuery('');
                setSearchResults([]);
            });
    };

    const privateChats = localConversations.filter(c => c.type === 'private' || !c.type);
    const groupChats = localConversations.filter(c => c.type === 'group');

    const renderConversation = (conversation) => (
        <Link
            key={conversation.id}
            href={route('chat.show', conversation.id)}
            className={`${styles.conversation} ${
                selectedConversation?.id === conversation.id ? styles.active : ''
            }`}
            preserveState
        >
            <div className={styles.avatar}>
                {conversation.name
                    ? conversation.name.charAt(0)
                    : conversation.users[0]?.name.charAt(0)}
                {conversation.unread_count > 0 && (
                    <span className={styles.unread}>{conversation.unread_count}</span>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.topRow}>
                    <p className={styles.name}>
                        {conversation.name || conversation.users[0].name}
                    </p>
                    <span className={styles.time}>
                        {conversation.messages.length > 0 &&
                            new Date(conversation.messages[0].created_at)
                                .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                <p className={styles.preview}>
                    {conversation.messages.length > 0
                        ? conversation.messages[0].body
                        : 'No messages yet'}
                </p>
            </div>
        </Link>
    );

    return (
        <div className={styles.sidebar}>
            {/* Search */}
            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
                <button
                    onClick={() => setIsGroupModalOpen(true)}
                    title="Create Group"
                >
                    ＋
                </button>
            </div>

            {/* Content */}
            <div className={styles.list}>
                {searchQuery ? (
                    isSearching ? (
                        <div className={styles.center}>Searching...</div>
                    ) : searchResults.length > 0 ? (
                        <>
                            <div className={styles.section}>Search Results</div>
                            {searchResults.map(user => (
                                <div
                                    key={user.id}
                                    className={styles.searchItem}
                                    onClick={() => startChat(user.id)}
                                >
                                    <div className={styles.searchAvatar}>
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className={styles.name}>{user.name}</p>
                                        <p className={styles.email}>{user.email}</p>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className={styles.center}>No users found</div>
                    )
                ) : (
                    <>
                        {groupChats.length > 0 && (
                            <>
                                <div className={styles.section}>Groups</div>
                                {groupChats.map(renderConversation)}
                            </>
                        )}

                        {privateChats.length > 0 && (
                            <>
                                <div className={styles.section}>Direct Messages</div>
                                {privateChats.map(renderConversation)}
                            </>
                        )}

                        {localConversations.length === 0 && (
                            <div className={styles.center}>
                                No conversations yet
                            </div>
                        )}
                    </>
                )}
            </div>

            <CreateGroupModal
                isOpen={isGroupModalOpen}
                onClose={() => setIsGroupModalOpen(false)}
            />
        </div>
    );
}
