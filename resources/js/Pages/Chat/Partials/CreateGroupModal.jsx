import { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from '@inertiajs/react';
import styles from '@/css/createGroupModal.module.css';

export default function CreateGroupModal({ isOpen, onClose, onSuccess }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        participants: []
    });

    useEffect(() => {
        if (!isOpen) {
            reset();
            setSearchQuery('');
            setSearchResults([]);
            setSelectedUsers([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const delay = setTimeout(() => {
            if (searchQuery.trim()) {
                setIsSearching(true);
                axios.get(route('users.search'), { params: { query: searchQuery } })
                    .then(res => {
                        const filtered = res.data.filter(
                            user => !selectedUsers.find(u => u.id === user.id)
                        );
                        setSearchResults(filtered);
                        setIsSearching(false);
                    })
                    .catch(() => setIsSearching(false));
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [searchQuery, selectedUsers]);

    const addUser = (user) => {
        const updated = [...selectedUsers, user];
        setSelectedUsers(updated);
        setData('participants', updated.map(u => u.id));
        setSearchQuery('');
        setSearchResults([]);
    };

    const removeUser = (id) => {
        const updated = selectedUsers.filter(u => u.id !== id);
        setSelectedUsers(updated);
        setData('participants', updated.map(u => u.id));
    };

    const submit = (e) => {
        e.preventDefault();
        axios.post(route('groups.store'), data)
            .then(res => {
                onClose();
                onSuccess(res.data.conversation_id);
            });
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3>Create New Group</h3>
                    <button onClick={onClose} className={styles.closeBtn}>×</button>
                </div>

                <form onSubmit={submit} className={styles.form}>
                    {/* Group Name */}
                    <div className={styles.field}>
                        <label>Group Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="My Awesome Group"
                        />
                        {errors.name && <p className={styles.error}>{errors.name}</p>}
                    </div>

                    {/* Participants */}
                    <div className={styles.fieldGrow}>
                        <label>Add Participants</label>

                        <div className={styles.chips}>
                            {selectedUsers.map(user => (
                                <span key={user.id} className={styles.chip}>
                                    {user.name}
                                    <button type="button" onClick={() => removeUser(user.id)}>×</button>
                                </span>
                            ))}
                        </div>

                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search users..."
                        />

                        <div className={styles.results}>
                            {isSearching ? (
                                <div className={styles.info}>Searching...</div>
                            ) : searchResults.length ? (
                                searchResults.map(user => (
                                    <div
                                        key={user.id}
                                        onClick={() => addUser(user)}
                                        className={styles.resultItem}
                                    >
                                        <div className={styles.avatar}>
                                            {user.name.charAt(0)}
                                        </div>
                                        {user.name}
                                    </div>
                                ))
                            ) : searchQuery ? (
                                <div className={styles.info}>No users found</div>
                            ) : null}
                        </div>

                        {errors.participants && (
                            <p className={styles.error}>{errors.participants}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.cancel}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing || !data.name || !selectedUsers.length}
                            className={styles.submit}
                        >
                            Create Group
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
