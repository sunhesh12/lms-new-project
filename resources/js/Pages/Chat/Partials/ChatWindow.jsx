import { useState, useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';

export default function ChatWindow({ user, conversation }) {
    const [messages, setMessages] = useState(conversation?.messages || []);
    const messagesEndRef = useRef(null);
    const { data, setData, post, processing, reset } = useForm({
        body: '',
        conversation_id: conversation?.id || '',
        reply_to_id: null,
        attachment: null,
        attachment_type: null
    });

    // States
    const [contextModal, setContextModal] = useState({ visible: false, message: null });
    const [replyingTo, setReplyingTo] = useState(null);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState([]);

    // Media States
    const fileInputRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setMessages(conversation?.messages || []);
        setReplyingTo(null);
        setSelectionMode(false);
        setSelectedMessages([]);
        reset();
    }, [conversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        setData(prev => ({ ...prev, conversation_id: conversation?.id || '' }));
    }, [conversation]);

    useEffect(() => {
        setData(prev => ({ ...prev, reply_to_id: replyingTo?.id || null }));
    }, [replyingTo]);

    useEffect(() => {
        if (conversation) {
            window.Echo.private(`chat.${conversation.id}`)
                .listen('.message.sent', (e) => {
                    setMessages(prev => [...prev, e.message]);
                    scrollToBottom();
                    axios.post(route('chat.read', conversation.id));
                })
                .listen('.message.read', (e) => {
                    if (e.userId !== user.id) setMessages(prev => [...prev]);
                })
                .listen('.message.deleted', (e) => {
                    setMessages(prev => prev.filter(m => m.id !== e.messageId));
                });

            axios.post(route('chat.read', conversation.id));

            return () => {
                window.Echo.leave(`chat.${conversation.id}`);
            };
        }
    }, [conversation]);

    const submit = (e) => {
        e.preventDefault();

        if (!data.body && !data.attachment) return;

        post(route('chat.store'), {
            onSuccess: () => {
                reset();
                setReplyingTo(null);
                // Clear file input
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
            preserveScroll: true,
            forceFormData: true // Ensure resizing/files work
        });
    };

    // File Handling
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        let type = 'pdf';
        if (file.type.startsWith('image/')) type = 'image';
        else if (file.type.startsWith('video/')) type = 'video';
        else if (file.type.startsWith('audio/')) type = 'audio';

        setData(prev => ({ ...prev, attachment: file, attachment_type: type }));
    };

    // Voice Recording
    const toogleRecording = async () => {
        if (isRecording) {
            // Stop recording
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        } else {
            // Start recording
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                audioChunksRef.current = [];

                mediaRecorderRef.current.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };

                mediaRecorderRef.current.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    const audioFile = new File([audioBlob], "voice_message.webm", { type: 'audio/webm' });

                    setData(prev => ({ ...prev, attachment: audioFile, attachment_type: 'audio' }));

                    // Auto submit voice notes? Or let user send? Let's let user send for now.
                };

                mediaRecorderRef.current.start();
                setIsRecording(true);
            } catch (err) {
                console.error("Error accessing microphone:", err);
                alert("Could not access microphone.");
            }
        }
    };

    // ... existing handlers ...
    const handleMessageClick = (message) => {
        if (selectionMode) {
            toggleSelection(message.id);
        }
    };

    const handleContextMenu = (e, message) => {
        e.preventDefault();
        if (selectionMode) return;
        setContextModal({ visible: true, message: message });
    };

    const toggleSelection = (msgId) => {
        if (selectedMessages.includes(msgId)) {
            setSelectedMessages(prev => prev.filter(id => id !== msgId));
        } else {
            setSelectedMessages(prev => [...prev, msgId]);
        }
    };

    const closeContextModal = () => setContextModal({ visible: false, message: null });

    const startReply = () => {
        setReplyingTo(contextModal.message);
        closeContextModal();
    };

    const startSelection = () => {
        setSelectionMode(true);
        setSelectedMessages([contextModal.message.id]);
        closeContextModal();
    };

    const cancelSelection = () => {
        setSelectionMode(false);
        setSelectedMessages([]);
    };

    const deleteForMe = () => {
        if (!contextModal.message) return;
        const msgId = contextModal.message.id;
        axios.post(route('messages.delete.me', msgId))
            .then(() => {
                setMessages(prev => prev.filter(m => m.id !== msgId));
                closeContextModal();
            });
    };

    const deleteForEveryone = () => {
        if (!contextModal.message) return;
        const msgId = contextModal.message.id;
        axios.post(route('messages.delete.everyone', msgId))
            .then(() => {
                setMessages(prev => prev.filter(m => m.id !== msgId));
                closeContextModal();
            });
    };

    const deleteSelected = () => {
        axios.post(route('messages.delete.multiple'), { message_ids: selectedMessages })
            .then(() => {
                setMessages(prev => prev.filter(m => !selectedMessages.includes(m.id)));
                cancelSelection();
            });
    };

    if (!conversation) {
        return (
            <div className="w-2/3 flex items-center justify-center text-gray-500 font-medium">
                Select a conversation to start chatting
            </div>
        );
    }

    return (
        <div className="w-2/3 flex flex-col relative h-full">
            {/* Header */}
            <div className={`p-4 border-b border-gray-200 backdrop-blur-md flex justify-between items-center z-10 ${selectionMode ? 'bg-indigo-50' : 'bg-white/50'}`}>
                {selectionMode ? (
                    <div className="flex items-center w-full justify-between">
                        <div className="flex items-center">
                            <button onClick={cancelSelection} className="mr-4 text-gray-600 hover:text-gray-900">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <span className="font-semibold text-lg text-indigo-900">{selectedMessages.length} Selected</span>
                        </div>
                        <button onClick={deleteSelected} disabled={selectedMessages.length === 0} className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 disabled:opacity-50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <h3 className="font-semibold text-gray-800">
                        {/* {conversation.name || conversation.users.map(u => u.name).join(', ')} */}
                        {conversation.name || conversation.users[0].name}
                    </h3>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex items-end ${message.user_id === user.id ? 'justify-end' : 'justify-start'} ${selectionMode ? 'cursor-pointer' : ''}`}
                        onClick={() => handleMessageClick(message)}
                    >
                        {selectionMode && (
                            <div className={`mr-2 flex items-center justify-center h-5 w-5 rounded border ${selectedMessages.includes(message.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                                {selectedMessages.includes(message.id) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                            </div>
                        )}

                        <div
                            onContextMenu={(e) => handleContextMenu(e, message)}
                            className={`max-w-[70%] rounded-2xl p-3 shadow-sm relative transition-colors ${selectionMode && selectedMessages.includes(message.id) ? 'ring-2 ring-indigo-400 ring-offset-1' : ''
                                } ${message.user_id === user.id
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : 'bg-white text-gray-900 rounded-bl-none border border-gray-100'
                                }`}
                        >
                            {/* Reply Quote */}
                            {message.reply_to && (
                                <div className={`mb-2 p-2 rounded text-xs border-l-4 opacity-90 ${message.user_id === user.id ? 'bg-indigo-700 border-indigo-300 text-indigo-100' : 'bg-gray-100 border-indigo-500 text-gray-600'}`}>
                                    <p className="font-bold mb-0.5">{message.reply_to.user?.name || 'Deleted Message'}</p>
                                    <p className="truncate">{message.reply_to.body || ''}</p>
                                </div>
                            )}

                            {/* Sender Name in Group */}
                            {conversation.type === 'group' && message.user_id !== user.id && (
                                <p className="text-xs text-indigo-500 font-bold mb-1">
                                    {message.user?.name}
                                </p>
                            )}

                            {/* Media Rendering */}
                            {message.attachment_path && (
                                <div className="mb-2">
                                    {message.attachment_type === 'image' && (
                                        <img src={message.attachment_url} alt="Attachment" className="rounded-lg max-h-64 object-cover w-full" />
                                    )}
                                    {message.attachment_type === 'video' && (
                                        <video src={message.attachment_url} controls className="rounded-lg max-h-64 w-full" />
                                    )}
                                    {message.attachment_type === 'audio' && (
                                        <audio src={message.attachment_url} controls className="w-full min-w-[280px] mt-1 mb-1" />
                                    )}
                                    {message.attachment_type === 'pdf' && (
                                        <a href={message.attachment_url} target="_blank" rel="noopener noreferrer" className={`flex items-center p-2 rounded-lg ${message.user_id === user.id ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm underline truncate">View PDF Attachment</span>
                                        </a>
                                    )}
                                </div>
                            )}

                            {message.body && <p className="text-sm leading-relaxed">{message.body}</p>}

                            <div className="flex items-center justify-end space-x-1 mt-1 opacity-80">
                                <span className="text-[10px]">
                                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {message.user_id === user.id && (
                                    <span className="text-[10px] font-bold ml-1">✓✓</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white/50 backdrop-blur-md">
                {/* Reply Preview */}
                {replyingTo && (
                    <div className="flex items-center justify-between bg-gray-100 p-2 rounded-t-lg border-b border-gray-200 mb-2">
                        <div className="flex-1 border-l-4 border-indigo-500 pl-2">
                            <p className="text-xs text-indigo-600 font-bold">Replying to {replyingTo.user?.name}</p>
                            <p className="text-sm text-gray-600 truncate">{replyingTo.body}</p>
                        </div>
                        <button onClick={() => setReplyingTo(null)} className="text-gray-500 hover:text-gray-800 p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* File Preview */}
                {data.attachment && (
                    <div className="flex items-center justify-between bg-indigo-50 p-2 rounded-t-lg border-b border-indigo-100 mb-2">
                        <span className="text-sm text-indigo-900 truncate flex items-center">
                            <span className="font-bold mr-2 uppercase text-xs bg-indigo-200 px-1 rounded">{data.attachment_type}</span>
                            {data.attachment.name}
                        </span>
                        <button onClick={() => setData(prev => ({ ...prev, attachment: null, attachment_type: null }))} className="text-indigo-400 hover:text-indigo-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}

                <form onSubmit={submit} className="flex space-x-2 items-center">
                    {/* Attachment Button */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*,video/*,audio/*,application/pdf"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                        title="Attach File"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </button>

                    <input
                        type="text"
                        value={data.body}
                        onChange={e => setData('body', e.target.value)}
                        className="flex-1 rounded-full border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white/80"
                        placeholder={replyingTo ? "Type your reply..." : (isRecording ? "Recording..." : "Type a message...")}
                        disabled={processing || selectionMode || isRecording}
                    />

                    {/* Mic Button */}
                    <button
                        type="button"
                        onClick={toogleRecording}
                        className={`p-2 rounded-full transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-gray-500 hover:text-indigo-600'}`}
                        title={isRecording ? "Stop Recording" : "Record Voice"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <button
                        type="submit"
                        disabled={processing || selectionMode || (!data.body && !data.attachment)}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 font-medium transition-colors shadow-md shadow-indigo-200"
                    >
                        Send
                    </button>
                </form>
            </div>

            {/* Modal Popup (Simple & Non-blocking) */}
            {contextModal.visible && (
                <div className="absolute inset-0 z-50 flex items-center justify-center" onClick={closeContextModal}>
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 w-64 transform transition-all" onClick={e => e.stopPropagation()}>
                        <div className="space-y-2">
                            <button
                                onClick={startReply}
                                className="w-full flex items-center justify-start rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                                Reply
                            </button>

                            <button
                                onClick={startSelection}
                                className="w-full flex items-center justify-start rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Select Messages
                            </button>

                            <div className="h-px bg-gray-100 my-1"></div>

                            <button
                                onClick={deleteForMe}
                                className="w-full flex items-center justify-start rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete for me
                            </button>

                            {contextModal.message?.user_id === user.id && (
                                <button
                                    onClick={deleteForEveryone}
                                    className="w-full flex items-center justify-start rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete for everyone
                                </button>
                            )}

                            <button
                                onClick={closeContextModal}
                                className="w-full flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium text-gray-400 hover:text-gray-600 mt-1"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
