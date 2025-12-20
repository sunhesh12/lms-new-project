import { Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Search, Plus, Users, ArrowLeft, MessageCircle, Camera } from 'lucide-react';
import axios from 'axios';
import CreateGroupModal from './CreateGroupModal';
import ProfileSettingsModal from './ProfileSettingsModal';
import style from '@/css/chatSidebar.module.css';

export default function ChatSidebar({ auth, conversations, selectedConversation, isMobile, showSidebar }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [view, setView] = useState('chats'); // 'chats' or 'contacts'
    const [allContacts, setAllContacts] = useState([]);
    const [localConversations, setLocalConversations] = useState(conversations);
    const [popupContact, setPopupContact] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all', 'direct', 'groups'
    const [showProfileModal, setShowProfileModal] = useState(false);

    // Sync prop changes to local state
    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    // Search Logic
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.trim()) {
                setIsSearching(true);
                axios.get(route('users.search'), { params: { query: searchQuery } })
                    .then(response => {
                        setSearchResults(response.data);
                        setIsSearching(false);
                    })
                    .catch(error => {
                        console.error('Error searching users:', error);
                        setIsSearching(false);
                    });
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Fetch All Contacts
    const fetchAllContacts = async () => {
        try {
            const response = await axios.get(route('users.search'), { params: { query: '' } });
            setAllContacts(response.data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const toggleContacts = () => {
        if (view === 'chats') {
            fetchAllContacts();
            setView('contacts');
        } else {
            setView('chats');
        }
    };

    // Listen for Echo events
    useEffect(() => {
        if (!window.Echo) return;

        const channelIds = localConversations.map(c => c.id);
        channelIds.forEach(id => {
            window.Echo.private(`chat.${id}`)
                .listen('.message.sent', (e) => {
                    setLocalConversations(prev => {
                        const isMe = e.message.user_id === auth?.user?.id;
                        return prev.map(c => {
                            if (c.id === e.message.conversation_id) {
                                const shouldIncrement = selectedConversation?.id !== c.id && !isMe;
                                return {
                                    ...c,
                                    messages: [e.message, ...(c.messages || [])],
                                    unread_count: shouldIncrement ? (c.unread_count || 0) + 1 : (c.unread_count || 0)
                                };
                            }
                            return c;
                        }).sort((a, b) => {
                            const dateA = new Date(a.messages?.[0]?.created_at || a.created_at);
                            const dateB = new Date(b.messages?.[0]?.created_at || b.created_at);
                            return dateB - dateA;
                        });
                    });
                });
        });

        return () => {
            channelIds.forEach(id => {
                if (window.Echo) window.Echo.leave(`chat.${id}`);
            });
        };
    }, [conversations.length, selectedConversation?.id]);

    const startChat = (userId) => {
        axios.post(route('conversations.check'), { user_id: userId })
            .then(response => {
                const conversationId = response.data.conversation_id;
                router.visit(route('chat.show', conversationId));
                setSearchQuery('');
                setSearchResults([]);
                setView('chats');
                setPopupContact(null);
            })
            .catch(error => {
                console.error('Error starting chat:', error);
            });
    };

    const handleGroupCreated = (conversationId) => {
        router.visit(route('chat.show', conversationId));
        setShowGroupModal(false);
    };

    const filteredConversations = localConversations.filter(c => {
        if (filter === 'all') return true;
        if (filter === 'groups') return c.type === 'group';
        if (filter === 'direct') return c.type === 'private' || !c.type;
        return true;
    });

    const getConversationName = (conversation) => {
        if (conversation.name) return conversation.name;
        const otherUser = conversation.users?.find(u => u.id !== auth.user.id);
        return otherUser?.name || 'Unknown User';
    };

    const renderConversation = (conversation) => (
        <Link
            key={conversation.id}
            href={route('chat.show', conversation.id)}
            className={`${style.convItem} ${selectedConversation?.id === conversation.id ? style.convSelected : ''}`}
            preserveState
        >
            <div className={style.convHeader}>
                <div className={style.convAvatar}>
                    {(() => {
                        if (conversation.type === 'group') {
                            return getConversationName(conversation).charAt(0).toUpperCase();
                        }
                        const otherUser = conversation.users?.find(u => u.id !== auth.user.id);
                        if (otherUser?.avatar_url) {
                            return <img src={otherUser.avatar_url} alt={otherUser.name} className="w-full h-full rounded-[14px] object-cover" />;
                        }
                        return getConversationName(conversation).charAt(0).toUpperCase();
                    })()}
                    <span className={style.statusDot}></span>
                </div>
                <div className={style.convContent}>
                    <div className={style.convTop}>
                        <p className={style.convName}>
                            {getConversationName(conversation)}
                        </p>
                        <p className={style.convTime}>
                            {conversation.messages.length > 0 &&
                                new Date(conversation.messages[0].created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            }
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className={style.convPreview}>
                            {conversation.messages.length > 0 ? conversation.messages[0].body : 'No messages yet'}
                        </p>
                        {conversation.unread_count > 0 && (
                            <span className={style.unreadBadge}>
                                {conversation.unread_count}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );

    return (
        <div className={`${style.sidebar} ${isMobile && !showSidebar ? 'hidden' : 'block'} chat-sidebar`}>
            {view === 'chats' ? (
                <>
                    <div className={style.sidebarHeader}>
                        <div className={style.headerTop}>
                            <div className={style.headerTitleWrapper}>
                                <h2 className={style.headerTitle}>Chats</h2>
                                <div className={style.headerAvatar} title="Profile">
                                    {auth.user.avatar_url ? (
                                        <img src={auth.user.avatar_url} alt={auth.user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        auth.user.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                            </div>
                            <div className={style.headerActions}>
                                <button
                                    onClick={() => setShowGroupModal(true)}
                                    className={style.headerActionBtn}
                                    title="Create Group"
                                >
                                    <Plus size={20} />
                                </button>
                                <button
                                    onClick={() => {
                                        alert('Camera button clicked! Opening modal...');
                                        setShowProfileModal(true);
                                    }}
                                    className={style.headerActionBtn}
                                    title="Change Profile Picture"
                                >
                                    <Camera size={20} />
                                </button>
                            </div>
                        </div>

                        <div className={style.searchBar}>
                            <input
                                className={style.searchInput}
                                type="text"
                                placeholder="Search people..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className={style.searchIcon} />
                        </div>

                        {/* Filter Tabs */}
                        <div className={style.filterTabs}>
                            <button
                                className={`${style.filterTab} ${filter === 'all' ? style.filterTabActive : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                All
                            </button>
                            <button
                                className={`${style.filterTab} ${filter === 'direct' ? style.filterTabActive : ''}`}
                                onClick={() => setFilter('direct')}
                            >
                                Direct
                            </button>
                            <button
                                className={`${style.filterTab} ${filter === 'groups' ? style.filterTabActive : ''}`}
                                onClick={() => setFilter('groups')}
                            >
                                Groups
                            </button>
                        </div>
                    </div>

                    <div className={style.list}>
                        {searchQuery ? (
                            <div className="space-y-1">
                                <div className={style.section}>Search Results</div>
                                {isSearching ? (
                                    <div className={style.emptyText}>Searching...</div>
                                ) : searchResults.length > 0 ? (
                                    <>
                                        {searchResults.map((user) => (
                                            <div
                                                key={user.id}
                                                onClick={() => setPopupContact(user)}
                                                className={style.convItem}
                                            >
                                                <div className={style.convAvatar}>
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-[14px] object-cover" />
                                                    ) : (
                                                        user.name.charAt(0).toUpperCase()
                                                    )}
                                                    <span className={style.statusDot}></span>
                                                </div>
                                                <div className={style.convContent}>
                                                    <p className={style.convName}>{user.name}</p>
                                                    <p className={style.convPreview}>{user.email}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className={style.emptyText}>No people found with that name.</div>
                                )}
                            </div>
                        ) : (
                            <>
                                {filteredConversations.length > 0 ? (
                                    filteredConversations.map(renderConversation)
                                ) : (
                                    <div className={style.emptyText}>
                                        {filter === 'all'
                                            ? "No conversations yet. Tap the + button to find people!"
                                            : `No ${filter} found.`
                                        }
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <button
                        className={style.floatingBtn}
                        onClick={toggleContacts}
                        title="New Chat"
                    >
                        <Plus size={32} />
                    </button>
                </>
            ) : (
                <>
                    <div className={style.contactsHeader}>
                        <button className={style.backBtn} onClick={() => setView('chats')}>
                            <ArrowLeft size={24} />
                        </button>
                        <h2 className={style.contactsTitle}>Select Contact</h2>
                    </div>

                    <div className={style.list}>
                        <div className={style.section}>All Contacts</div>
                        {allContacts.length > 0 ? (
                            allContacts.map((user) => (
                                <div
                                    key={user.id}
                                    onClick={() => setPopupContact(user)}
                                    className={style.convItem}
                                >
                                    <div className={style.convAvatar}>
                                        {user.avatar_url ? (
                                            <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-[14px] object-cover" />
                                        ) : (
                                            user.name.charAt(0).toUpperCase()
                                        )}
                                        <span className={style.statusDot}></span>
                                    </div>
                                    <div className={style.convContent}>
                                        <p className={style.convName}>{user.name}</p>
                                        <p className={style.convPreview}>{user.email}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={style.emptyText}>Loading contacts...</div>
                        )}
                    </div>
                </>
            )
            }

            {/* Contact Action Popup */}
            {
                popupContact && (
                    <div className={style.contactPopupOverlay} onClick={() => setPopupContact(null)}>
                        <div className={style.contactPopupCard} onClick={e => e.stopPropagation()}>
                            <div className={style.popupAvatar}>
                                {popupContact?.avatar_url ? (
                                    <img src={popupContact.avatar_url} alt={popupContact.name} className="w-full h-full rounded-[1.75rem] object-cover" />
                                ) : (
                                    popupContact?.name?.charAt(0).toUpperCase()
                                )}
                            </div>
                            <h3 className={style.popupName}>{popupContact.name}</h3>
                            <p className={style.popupEmail}>{popupContact.email}</p>

                            <button
                                className={style.popupActionBtn}
                                onClick={() => startChat(popupContact.id)}
                            >
                                <MessageCircle size={14} />
                                Message
                            </button>

                            <button
                                className={style.popupCloseBtn}
                                onClick={() => setPopupContact(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )
            }

            <CreateGroupModal
                isOpen={showGroupModal}
                onClose={() => setShowGroupModal(false)}
                onSuccess={handleGroupCreated}
                auth={auth}
            />

            <ProfileSettingsModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                user={auth.user}
            />
        </div >
    );
}
