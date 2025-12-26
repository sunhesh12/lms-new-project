import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, UserPlus, Shield, UserMinus } from "lucide-react";
import styles from "@/css/components/module-staff.module.css";
import { router } from "@inertiajs/react";

export default function ModuleStaff({ module }) {
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (search.length > 2) {
            const delayDebounceFn = setTimeout(() => {
                handleSearch();
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        } else {
            setSearchResults([]);
        }
    }, [search]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/lecturers/search?query=${search}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error searching lecturers:", error);
        } finally {
            setLoading(false);
        }
    };

    const manageStaff = (lectureId, role, action) => {
        router.post(route('modules.staff.manage', module.id), {
            lecture_id: lectureId,
            role: role,
            action: action
        });
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2 className={styles.title}>Module Staff</h2>
                <p className={styles.subtitle}>Manage lecturers and assistants for this module.</p>
            </header>

            <div className={styles.searchSection}>
                <div className={styles.searchBox}>
                    <Search className={styles.searchIcon} size={18} />
                    <input
                        type="text"
                        placeholder="Search for lecturers by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                    {loading && <div className={styles.loader}></div>}
                </div>

                {searchResults.length > 0 && (
                    <div className={styles.resultsPopup}>
                        {searchResults.map((lecturer) => (
                            <div key={lecturer.id} className={styles.resultItem}>
                                <div className={styles.userInfo}>
                                    <p className={styles.userName}>{lecturer.user.name}</p>
                                    <p className={styles.userEmail}>{lecturer.user.email}</p>
                                </div>
                                <div className={styles.btnGroup}>
                                    <button
                                        onClick={() => manageStaff(lecturer.id, 'lecturer', 'add')}
                                        className={`${styles.addBtn} ${styles.btnLecturer}`}
                                    >
                                        <Shield size={12} /> Lecturer
                                    </button>
                                    <button
                                        onClick={() => manageStaff(lecturer.id, 'assistant', 'add')}
                                        className={`${styles.addBtn} ${styles.btnAssistant}`}
                                    >
                                        <UserPlus size={12} /> Assistant
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Staff Member</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {module.lecturers.map((staff) => (
                            <tr key={staff.id}>
                                <td>
                                    <div className={styles.userInfo}>
                                        <p className={styles.userName}>{staff.user.name}</p>
                                        <p className={styles.userEmail}>{staff.user.email}</p>
                                    </div>
                                </td>
                                <td>
                                    <span className={`${styles.statusBadge} ${staff.pivot.role === 'lecturer' ? styles.statusActive : styles.statusPending}`}>
                                        {staff.pivot.role}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        onClick={() => manageStaff(staff.id, staff.pivot.role, 'remove')}
                                        className={styles.actionBtnDelete}
                                        title="Remove Staff"
                                    >
                                        <UserMinus size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
