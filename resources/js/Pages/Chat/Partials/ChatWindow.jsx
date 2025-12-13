import { useState, useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import styles from '@/css/chatWindow.module.css';

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

    const [contextModal, setContextModal] = useState({ visible: false, message: null });
    const [replyingTo, setReplyingTo] = useState(null);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState([]);

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

    useEffect(scrollToBottom, [messages]);

    if (!conversation) {
        return (
            <div className={styles.empty}>
                Select a conversation to start chatting
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {/* Header */}
            <div className={`${styles.header} ${selectionMode ? styles.headerSelect : ''}`}>
                {selectionMode ? (
                    <div className={styles.selectionBar}>
                        <span>{selectedMessages.length} Selected</span>
                        <button className={styles.deleteBtn}>🗑</button>
                    </div>
                ) : (
                    <h3>{conversation.name || conversation.users[0].name}</h3>
                )}
            </div>

            {/* Messages */}
            <div className={styles.messages}>
                {messages.map(message => (
                    <div
                        key={message.id}
                        className={`${styles.messageRow} ${
                            message.user_id === user.id ? styles.me : styles.other
                        }`}
                    >
                        <div className={styles.bubble}>
                            {message.body && <p>{message.body}</p>}
                            <span className={styles.time}>
                                {new Date(message.created_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={styles.inputArea}>
                <form className={styles.form}>
                    <input
                        type="text"
                        value={data.body}
                        onChange={e => setData('body', e.target.value)}
                        placeholder="Type a message..."
                        disabled={processing}
                    />
                    <button type="submit" disabled={processing}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
