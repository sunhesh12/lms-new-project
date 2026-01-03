import { Link, useForm } from '@inertiajs/react';
import AudioPlayer from './AudioPlayer';
import { useState, useEffect, useRef } from 'react';
import {
    Send,
    Heart,
    Smile,
    Mic,
    Pin,
    FileText,
    Trash,
    Trash2,
    Reply,
    Copy,
    Check,
    X,
    ChevronLeft,
    MoreVertical,
    Cpu,
    Sparkles
} from 'lucide-react';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import style from '@/css/chatwindow.module.css';

const AI_UUID = '00000000-0000-0000-0000-000000000000';

export default function ChatWindow({ user, conversation, onBack, isStandalone = false }) {
    const [messages, setMessages] = useState([]);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const chatWindowRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
    const [isAiTyping, setIsAiTyping] = useState(false);

    // Context Menu States
    const [messageContext, setMessageContext] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [replyTo, setReplyTo] = useState(null);
    const [pdfPreview, setPdfPreview] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        body: '',
        attachment: null,
        reply_to_id: null,
        conversation_id: conversation?.id
    });

    const inputRef = useRef(null);
    const fileInputRef = useRef(null);

    // Media Recording
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const recordingIntervalRef = useRef(null);

    useEffect(() => {
        setMessages(conversation?.messages || []);
        setReplyTo(null);
        setSelectionMode(false);
        setSelectedMessages([]);
        reset();
        setData('conversation_id', conversation?.id);
        setIsAiTyping(false);
        scrollToBottom();
    }, [conversation]);

    useEffect(() => {
        setData(prev => ({ ...prev, reply_to_id: replyTo?.id || null }));
    }, [replyTo]);

    useEffect(() => {
        if (conversation && window.Echo) {
            window.Echo.private(`chat.${conversation.id}`)
                .listen('.message.sent', (e) => {
                    setMessages(prev => [...prev, e.message]);
                    if (e.message.user_id === AI_UUID) {
                        setIsAiTyping(false);
                    }
                    scrollToBottom();
                });

            return () => {
                window.Echo.leave(`chat.${conversation.id}`);
            };
        }
    }, [conversation?.id]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (processing || (!data.body && !data.attachment)) return;

        const isToAi = conversation.users?.some(u => u.id === AI_UUID);
        if (isToAi) {
            setIsAiTyping(true);
        }

        post(route('chat.store'), {
            onSuccess: () => {
                reset('body', 'attachment', 'reply_to_id');
                setReplyTo(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
                scrollToBottom();
            },
            onError: () => {
                setIsAiTyping(false);
            },
            preserveScroll: true
        });
    };

    const handleEmojiClick = (emojiData) => {
        setData('body', data.body + emojiData.emoji);
        setShowEmojiPicker(false);
        inputRef.current?.focus();
    };

    const handleFileSelection = (e) => {
        const file = e.target.files[0];
        if (file) {
            let type = file.type;
            if (file.type.startsWith('image/')) {
                type = file.type;
            } else if (file.type.startsWith('video/')) {
                type = file.type;
            } else if (file.type.startsWith('audio/')) {
                type = file.type;
            } else if (file.type === 'application/pdf') {
                type = 'pdf';
            }

            setData(prev => ({
                ...prev,
                attachment: file,
                attachment_type: type
            }));
            setShowAttachmentMenu(false);
        }
    };

    const toogleRecording = async () => {
        if (isRecording) {
            // Stop recording
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(recordingIntervalRef.current);
            setRecordingDuration(0);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) audioChunksRef.current.push(e.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    const file = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
                    setData(prev => ({
                        ...prev,
                        attachment: file,
                        attachment_type: 'audio'
                    }));
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorder.start();
                setIsRecording(true);
                setRecordingDuration(0);

                // Start timer
                recordingIntervalRef.current = setInterval(() => {
                    setRecordingDuration(prev => prev + 1);
                }, 1000);
            } catch (err) {
                console.error("Microphone access denied:", err);
            }
        }
    };

    const handleContextMenu = (e, message) => {
        e.preventDefault();
        if (selectionMode) return;

        const rect = chatWindowRef.current.getBoundingClientRect();
        setMenuPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        setMessageContext(message);
    };

    const toggleSelection = (msgId) => {
        if (selectedMessages.includes(msgId)) {
            setSelectedMessages(prev => prev.filter(id => id !== msgId));
        } else {
            setSelectedMessages(prev => [...prev, msgId]);
        }
    };

    const closeContextModal = () => setMessageContext(null);

    const startReply = () => {
        setReplyTo(messageContext);
        closeContextModal();
        inputRef.current?.focus();
    };

    const startSelection = () => {
        setSelectionMode(true);
        setSelectedMessages([messageContext.id]);
        closeContextModal();
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        closeContextModal();
    };

    const deleteForMe = () => {
        if (!messageContext) return;
        const msgId = messageContext.id;
        axios.post(route('messages.delete.me', msgId))
            .then(() => {
                setMessages(prev => prev.filter(m => m.id !== msgId));
                closeContextModal();
            });
    };

    const deleteForEveryone = () => {
        if (!messageContext) return;
        const msgId = messageContext.id;
        axios.post(route('messages.delete.everyone', msgId))
            .then(() => {
                setMessages(prev => prev.filter(m => m.id !== msgId));
                closeContextModal();
            });
    };

    const renderMessage = (msg) => {
        const isMe = msg.user_id === user.id;
        const isAi = msg.user_id === AI_UUID;
        const isSelected = selectedMessages.includes(msg.id);

        return (
            <div
                key={msg.id}
                className={`${style.messageRow} ${isMe ? style.me : style.other}`}
                onContextMenu={(e) => handleContextMenu(e, msg)}
                onClick={() => selectionMode && toggleSelection(msg.id)}
            >
                {selectionMode && (
                    <div className={style.flex_center_px_2}>
                        <div className={`${style.not_selected_text} ${isSelected ? style.selected : ''}`}>
                            {isSelected && <Check size={12} color="white" />}
                        </div>
                    </div>
                )}
                <div className={`${style.bubble} ${isMe ? style.bubbleSender : (isAi ? style.aiBubble : style.bubbleReceiver)} ${isSelected ? style.selectionRing : ''}`}>
                    {isAi && (
                        <div className={style.aiBadge}>
                            <Sparkles size={10} />
                            Academic AI
                        </div>
                    )}
                    {msg.reply_to && (
                        <div className={`${style.replyQuote} ${isMe ? style.replySender : style.replyReceiver}`}>
                            <p className="font-bold opacity-80">{msg.reply_to.user?.name}</p>
                            <p className="truncate">{msg.reply_to.body}</p>
                        </div>
                    )}

                    {msg.attachment_path && (
                        <div className={style.attachmentContainer}>
                            {msg.attachment_type?.startsWith('image/') ? (
                                <img src={`/storage/${msg.attachment_path}`} alt="Attachment" className={style.attachmentImage} />
                            ) : msg.attachment_type?.startsWith('video/') ? (
                                <video src={`/storage/${msg.attachment_path}`} controls className={style.attachmentVideo} />
                            ) : (msg.attachment_type?.startsWith('audio/') || msg.attachment_type === 'audio') ? (
                                <AudioPlayer audioUrl={`/storage/${msg.attachment_path}`} isMe={isMe} />
                            ) : (
                                <button onClick={() => setPdfPreview(`/storage/${msg.attachment_path}`)} className={`${style.attachmentPdf} ${isMe ? style.pdfSender : style.pdfReceiver}`}>
                                    <FileText size={18} className="mr-2" />
                                    <span>View File</span>
                                </button>
                            )}
                        </div>
                    )}

                    <p>{msg.body}</p>
                    <span className={style.time}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        );
    };

    if (!conversation) {
        return (
            <div className={style.empty}>
                <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100 max-w-sm mx-auto">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Send size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Your Conversations</h3>
                    <p className="text-slate-500 text-sm">Select a contact or group to start messaging.</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={chatWindowRef} className={style.wrapper}>
            <div className={`${style.header} ${selectionMode ? style.headerSelect : ''}`}>
                <div className={style.headerLeft}>
                    {!isStandalone && (
                        <button onClick={onBack} className={style.backButton}>
                            <ChevronLeft size={24} />
                        </button>
                    )}

                    {/* Header Avatar */}
                    {(() => {
                        const otherUser = conversation.users?.find(u => u.id !== user.id);
                        if (!otherUser) return null;

                        return (
                            <div className={style.headerAvatar}>
                                {otherUser.avatar_url ? (
                                    <img src={otherUser.avatar_url} alt={otherUser.name} className={style.header_avatar_image} />
                                ) : (
                                    <span>{otherUser.name.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                        );
                    })()}

                    <div className={style.headerInfoContainer}>
                        <h3>
                            {selectionMode ? `${selectedMessages.length} selected` : (conversation.name || conversation.users?.find(u => u.id !== user.id)?.name)}
                        </h3>
                        {!selectionMode && (() => {
                            const otherUser = conversation.users?.find(u => u.id !== user.id);
                            if (!otherUser) return null;

                            return (
                                <div className={`${style.headerStatus} ${otherUser.online ? style.onlineStatus : ''}`}>
                                    <span className={`${style.statusDot} ${otherUser.online ? style.onlineDot : ''}`} />
                                    {otherUser.online ? 'Online' : (otherUser.last_seen ? `Last seen ${new Date(otherUser.last_seen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Offline')}
                                </div>
                            );
                        })()}
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {selectionMode ? (
                        <>
                            <button className={style.iconBtn} onClick={() => setSelectionMode(false)} title="Cancel">
                                <X size={20} />
                            </button>
                            <button className={`${style.iconBtn} ${style.deleteBtn}`} title="Delete Selected">
                                <Trash2 size={20} />
                            </button>
                        </>
                    ) : (
                        <button className={style.iconBtn}>
                            <MoreVertical size={20} />
                        </button>
                    )}
                </div>
            </div>

            <div className={style.messagesArea}>
                {messages.map(renderMessage)}
                {isAiTyping && (
                    <div className={style.messageRow} style={{ justifyContent: 'flex-start' }}>
                        <div className={style.typingIndicator}>
                            <div className={style.dot}></div>
                            <div className={style.dot}></div>
                            <div className={style.dot}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className={style.inputArea}>
                {data.attachment && (
                    <div className={`${style.inputPreview} ${style.previewFile}`}>
                        <div className="flex items-center gap-2">
                            <FileText size={16} className="text-green-600" />
                            <span className="text-sm font-medium text-green-700">{data.attachment.name}</span>
                        </div>
                        <button onClick={() => setData('attachment', null)} className={style.iconBtn}>
                            <X size={16} />
                        </button>
                    </div>
                )}


                <div className={style.inputWrapper}>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={style.utilBtn}
                        title="Attach file"
                    >
                        <Pin size={22} />
                    </button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileSelection}
                        accept="image/*,video/*,audio/*,.pdf,application/*"
                    />

                    <form onSubmit={handleSend} className={style.form}>
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className={style.utilBtn}
                        >
                            <Smile size={22} />
                        </button>

                        {showEmojiPicker && (
                            <div className={style.emojiPickerContainer}>
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </div>
                        )}

                        <div className="flex-1 flex flex-col">
                            {replyTo && (
                                <div className={`${style.inputPreview} ${style.previewReply}`}>
                                    <div className="flex-1 border-l-4 border-indigo-500 pl-2">
                                        <p className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-tight">Replying to {replyTo.user?.name}</p>
                                        <p className="text-xs text-slate-600 truncate">{replyTo.body}</p>
                                    </div>
                                    <button onClick={() => setReplyTo(null)} className={style.utilBtn}>
                                        <X size={14} />
                                    </button>
                                </div>
                            )}

                            <input
                                ref={inputRef}
                                type="text"
                                value={data.body}
                                onChange={e => setData('body', e.target.value)}
                                placeholder={replyTo ? "Type your reply..." : (isRecording ? "Recording..." : "Type a message...")}
                                disabled={processing || selectionMode || isRecording}
                                onFocus={() => {
                                    setShowEmojiPicker(false);
                                    setShowAttachmentMenu(false);
                                }}
                            />
                        </div>
                    </form>

                    {isRecording && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: '#fee2e2',
                            borderRadius: '1rem',
                            color: '#dc2626',
                            fontWeight: '600',
                            fontSize: '0.875rem'
                        }}>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#dc2626',
                                animation: 'pulse 1.5s infinite'
                            }} />
                            Recording {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={toogleRecording}
                        className={`${style.utilBtn} ${isRecording ? 'bg-red-500 text-white animate-pulse' : ''}`}
                    >
                        <Mic size={24} />
                    </button>

                    <button
                        type="submit"
                        onClick={handleSend}
                        className={style.sendBtn}
                        disabled={processing || selectionMode || (!data.body && !data.attachment)}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>

            {messageContext && (
                <div className={style.modalBackdrop} onClick={() => setMessageContext(null)}>
                    <div
                        className={style.modalContent}
                        onClick={e => e.stopPropagation()}
                        style={{
                            position: 'absolute',
                            left: `${Math.min(menuPosition.x, chatWindowRef.current.clientWidth - 230)}px`,
                            top: `${Math.min(menuPosition.y, chatWindowRef.current.clientHeight - 250)}px`,
                            zIndex: 1000
                        }}
                    >
                        <button onClick={startReply} className={style.modalAction}>
                            <Reply size={14} className={style.modalIcon} />
                            Reply
                        </button>
                        <button onClick={() => handleCopy(messageContext.body)} className={style.modalAction}>
                            <Copy size={14} className={style.modalIcon} />
                            Copy Text
                        </button>
                        <button onClick={startSelection} className={style.modalAction}>
                            <Check size={14} className={style.modalIcon} />
                            Select Messages
                        </button>

                        <div className={style.modalSeparator} />

                        {messageContext.user_id === user.id && (
                            <button onClick={deleteForEveryone} className={`${style.modalAction} ${style.modalDelete}`}>
                                <Trash2 size={14} className={style.modalIcon} />
                                Delete for Everyone
                            </button>
                        )}
                        <button onClick={deleteForMe} className={`${style.modalAction} ${style.modalDelete}`}>
                            <Trash size={14} className={style.modalIcon} />
                            Delete for Me
                        </button>
                    </div>
                </div>
            )}

            {/* PDF Preview Modal */}
            {pdfPreview && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.9)',
                        zIndex: 10000,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '1rem'
                    }}
                    onClick={() => setPdfPreview(null)}
                >
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        color: 'white'
                    }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Document Preview</h3>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <a
                                href={pdfPreview}
                                download
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: '#4f46e5',
                                    color: 'white',
                                    borderRadius: '0.5rem',
                                    textDecoration: 'none',
                                    fontSize: '0.875rem',
                                    fontWeight: '500'
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                Download
                            </a>
                            <button
                                onClick={() => setPdfPreview(null)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: '500'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                    <iframe
                        src={pdfPreview}
                        style={{
                            flex: 1,
                            border: 'none',
                            borderRadius: '0.5rem',
                            background: 'white'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
