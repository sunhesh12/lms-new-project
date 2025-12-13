import { Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CreateGroupModal from './CreateGroupModal';

export default function ChatSidebar({ conversations, selectedConversation, setSelectedConversation }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

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

    const [localConversations, setLocalConversations] = useState(conversations);

    // Sync prop changes to local state (for sender updates via Inertia)
    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    // Listen for new messages on all conversations to update sidebar order and unread counts
    useEffect(() => {
        // Create a set of IDs to avoid duplicate listeners if key changes slightly
        const channelIds = localConversations.map(c => c.id);

        channelIds.forEach(id => {
            window.Echo.private(`chat.${id}`)
                .listen('.message.sent', (e) => {
                    setLocalConversations(prev => {
                        // Find conversation to update
                        const exists = prev.find(c => c.id === e.message.conversation_id);
                        if (!exists) return prev; // Should not happen if data is consistent

                        const updatedConversations = prev.map(c => {
                            if (c.id === e.message.conversation_id) {
                                return {
                                    ...c,
                                    // Add new message to top of messages array
                                    messages: [e.message, ...(c.messages || [])],
                                    // Increment unread if NOT the active conversation
                                    unread_count: selectedConversation?.id === c.id ? 0 : (c.unread_count || 0) + 1
                                };
                            }
                            return c;
                        });

                        // Move updated conversation to top of the list
                        return updatedConversations.sort((a, b) => {
                            const dateA = new Date(a.messages?.[0]?.created_at || a.created_at);
                            const dateB = new Date(b.messages?.[0]?.created_at || b.created_at);
                            return dateB - dateA;
                        });
                    });
                })
                .listen('.message.read', (e) => {
                    // Could implement read receipt logic here
                });
        });

        return () => {
            channelIds.forEach(id => window.Echo.leave(`chat.${id}`));
        }
    }, [localConversations.map(c => c.id).join(',')]);

    const startChat = (userId) => {
        axios.post(route('conversations.check'), { user_id: userId })
            .then(response => {
                const conversationId = response.data.conversation_id;
                router.visit(route('chat.show', conversationId));
                setSearchQuery('');
                setSearchResults([]);
            })
            .catch(error => {
                console.error('Error starting chat:', error);
            });
    };

    const handleGroupCreated = (conversationId) => {
        router.visit(route('chat.show', conversationId));
    };

    const privateChats = localConversations.filter(c => c.type === 'private' || !c.type);
    const groupChats = localConversations.filter(c => c.type === 'group');

    const renderConversation = (conversation) => (
        <Link
            key={conversation.id}
            href={route('chat.show', conversation.id)}
            className={`block p-4 hover:bg-gray-50 cursor-pointer ${selectedConversation?.id === conversation.id ? 'bg-gray-100' : ''
                }`}
            preserveState
        >
            <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold relative">
                    {conversation.name ? conversation.name.charAt(0) : conversation.users[0]?.name.charAt(0)}
                    {conversation.unread_count > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unread_count}
                        </span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {/* {conversation.name || conversation.users.map(u => u.name).join(', ')} */}
                            {conversation.name || conversation.users[0].name}
                        </p>
                        <p className="text-xs text-gray-500">
                            {conversation.messages.length > 0 &&
                                new Date(conversation.messages[0].created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            }
                        </p>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                        {conversation.messages.length > 0 ? conversation.messages[0].body : 'No messages yet'}
                    </p>
                </div>
            </div>
        </Link>
    );

    return (
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex space-x-2">
                <input
                    type="text"
                    placeholder="Search users..."
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    onClick={() => setIsGroupModalOpen(true)}
                    className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700"
                    title="Create Group"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {searchQuery ? (
                    <div>
                        {isSearching ? (
                            <div className="p-4 text-center text-gray-500">Searching...</div>
                        ) : searchResults.length > 0 ? (
                            <>
                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                                    Search Results
                                </div>
                                {searchResults.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => startChat(user.id)}
                                        className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                                    >
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="p-4 text-center text-gray-500">No users found</div>
                        )}
                    </div>
                ) : (
                    <>
                        {groupChats.length > 0 && (
                            <>
                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-100">
                                    Groups
                                </div>
                                {groupChats.map(renderConversation)}
                            </>
                        )}

                        {privateChats.length > 0 && (
                            <>
                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-100">
                                    Direct Messages
                                </div>
                                {privateChats.map(renderConversation)}
                            </>
                        )}

                        {localConversations.length === 0 && (
                            <div className="p-4 text-center text-gray-500">
                                No conversations yet. Search for a user to start chatting!
                            </div>
                        )}
                    </>
                )}
            </div>

            <CreateGroupModal
                isOpen={isGroupModalOpen}
                onClose={() => setIsGroupModalOpen(false)}
                onSuccess={handleGroupCreated}
            />
        </div>
    );
}
