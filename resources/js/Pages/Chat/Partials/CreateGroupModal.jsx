import { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from '@inertiajs/react';
import style from '@/css/createGroupModal.module.css';

export default function CreateGroupModal({ isOpen, onClose, onSuccess, auth }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Form for group creation
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

    // Handle user search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.trim()) {
                setIsSearching(true);
                axios.get(route('users.search'), { params: { query: searchQuery } })
                    .then(response => {
                        // Filter out already selected users
                        const filtered = response.data.filter(user =>
                            !selectedUsers.find(u => u.id === user.id)
                        );
                        setSearchResults(filtered);
                        setIsSearching(false);
                    })
                    .catch(error => {
                        console.error('Error searching:', error);
                        setIsSearching(false);
                    });
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, selectedUsers]);

    const addUser = (user) => {
        const newSelected = [...selectedUsers, user];
        setSelectedUsers(newSelected);
        setData('participants', newSelected.map(u => u.id));
        setSearchQuery('');
        setSearchResults([]);
    };

    const removeUser = (userId) => {
        const newSelected = selectedUsers.filter(u => u.id !== userId);
        setSelectedUsers(newSelected);
        setData('participants', newSelected.map(u => u.id));
    };

    const submit = (e) => {
        e.preventDefault();
        axios.post(route('groups.store'), data)
            .then(response => {
                onClose();
                onSuccess(response.data.conversation_id);
            })
            .catch(error => {
                console.error('Error creating group:', error);
            });
    };

    if (!isOpen) return null;

    return (
        <div className={style.overlay}>
            <div className={style.modal}>
                <div className={style.header}>
                    <h3>Create New Group</h3>
                    <button onClick={onClose} className={style.closeBtn}>&times;</button>
                </div>

                <form onSubmit={submit} className={style.form}>
                    <div className={style.field}>
                        <label>Group Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="My Awesome Group"
                        />
                        {errors.name && <p className={style.error}>{errors.name}</p>}
                    </div>

                    <div className={style.fieldGrow}>
                        <label>Add Participants</label>

                        {/* Selected Users Chips */}
                        <div className={style.chips}>
                            {selectedUsers.map(user => (
                                <span key={user.id} className={style.chip}>
                                    {user.name}
                                    <button
                                        type="button"
                                        onClick={() => removeUser(user.id)}
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>

                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="mb-2" /* Keep small margin for spacing if needed, or update CSS */
                            placeholder="Search users..."
                        />

                        {/* Search Results */}
                        <div className={style.results}>
                            {isSearching ? (
                                <div className={style.info}>Searching...</div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map(user => (
                                    <div
                                        key={user.id}
                                        onClick={() => addUser(user)}
                                        className={style.resultItem}
                                    >
                                        <div className={style.avatar}>
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>{user.name}</div>
                                    </div>
                                ))
                            ) : searchQuery ? (
                                <div className={style.info}>No users found</div>
                            ) : null}
                        </div>
                        {errors.participants && <p className={style.error}>{errors.participants}</p>}
                    </div>

                    <div className={style.actions}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={style.cancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing || selectedUsers.length === 0 || !data.name}
                            className={style.submit}
                        >
                            Create Group
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
