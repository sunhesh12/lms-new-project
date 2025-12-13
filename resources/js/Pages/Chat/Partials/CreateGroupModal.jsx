import { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from '@inertiajs/react';

export default function CreateGroupModal({ isOpen, onClose, onSuccess }) {
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative border p-6 shadow-lg rounded-lg bg-white w-96 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Group</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={submit} className="flex flex-col flex-1 min-h-0">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Group Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="My Awesome Group"
                        />
                        {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
                    </div>

                    <div className="mb-4 flex-1 flex flex-col min-h-0">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Add Participants
                        </label>

                        {/* Selected Users Chips */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            {selectedUsers.map(user => (
                                <span key={user.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {user.name}
                                    <button
                                        type="button"
                                        onClick={() => removeUser(user.id)}
                                        className="ml-1 text-indigo-500 hover:text-indigo-700 focus:outline-none"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>

                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                            placeholder="Search users..."
                        />

                        {/* Search Results */}
                        <div className="flex-1 overflow-y-auto border rounded bg-gray-50">
                            {isSearching ? (
                                <div className="p-2 text-center text-gray-500 text-sm">Searching...</div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map(user => (
                                    <div
                                        key={user.id}
                                        onClick={() => addUser(user)}
                                        className="p-2 hover:bg-gray-200 cursor-pointer flex items-center"
                                    >
                                        <div className="h-6 w-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold mr-2">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="text-sm">{user.name}</div>
                                    </div>
                                ))
                            ) : searchQuery ? (
                                <div className="p-2 text-center text-gray-500 text-sm">No users found</div>
                            ) : null}
                        </div>
                        {errors.participants && <p className="text-red-500 text-xs italic mt-1">{errors.participants}</p>}
                    </div>

                    <div className="flex justify-end pt-2 border-t mt-auto">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mr-2 bg-white text-gray-700 border border-gray-300 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing || selectedUsers.length === 0 || !data.name}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                        >
                            Create Group
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
