import { useState, useEffect } from "react";
import styles from "@/css/components/enrollments.module.css";
import { Search, UserPlus, Trash2, AlertTriangle } from "lucide-react";
import { router } from "@inertiajs/react";
import axios from "axios";

export default function Enrollments({ module }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showRemoveAllDialog, setShowRemoveAllDialog] = useState(false);

    useEffect(() => {
        // Initial load of students (if API supports empty query)
        handleSearch("");
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch(searchQuery);
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSearch = async (query) => {
        setLoading(true);
        try {
            // Use module-specific endpoint to get only available (non-enrolled) students
            const response = await axios.get(route('module.available-students', { moduleId: module.id, query: query }));
            setSearchResults(response.data);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = (studentId) => {
        router.post(route('module.enroll', { moduleId: module.id }), {
            student_id: studentId
        }, {
            onSuccess: () => {
                setSearchQuery("");
                setSearchResults([]);
            }
        });
    };

    const handleDelete = (registrationId) => {
        if (confirm("Are you sure you want to remove this student?")) {
            router.delete(route('module.unenroll', {
                moduleId: module.id,
                registrationId: registrationId
            }));
        }
    };

    const handleRemoveAll = () => {
        router.delete(route('module.unenroll-all', { moduleId: module.id }), {
            onSuccess: () => {
                setShowRemoveAllDialog(false);
            }
        });
    };

    const enrolledCount = module.students?.length || 0;
    const capacity = module.maximum_students;
    const isFull = capacity > 0 && enrolledCount >= capacity;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h2 className={styles.title}>
                        Module Enrollments
                    </h2>
                    <p className={styles.subtitle}>
                        Enroll students in {module.name}.
                        {capacity > 0 && (
                            <span style={{ marginLeft: '10px', fontWeight: 'bold', color: isFull ? 'var(--danger)' : 'var(--success)' }}>
                                ({enrolledCount}/{capacity} enrolled)
                            </span>
                        )}
                    </p>
                </div>
                {enrolledCount > 0 && (
                    <button
                        className={styles.removeAllBtn}
                        onClick={() => setShowRemoveAllDialog(true)}
                        title="Remove All Students"
                    >
                        <Trash2 size={18} />
                        Remove All ({enrolledCount})
                    </button>
                )}
            </header>

            {/* Remove All Confirmation Dialog */}
            {showRemoveAllDialog && (
                <div className={styles.dialogOverlay} onClick={() => setShowRemoveAllDialog(false)}>
                    <div className={styles.dialogBox} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.dialogIcon}>
                            <AlertTriangle size={48} />
                        </div>
                        <h3 className={styles.dialogTitle}>Remove All Students?</h3>
                        <p className={styles.dialogMessage}>
                            This will remove all <strong>{enrolledCount} student(s)</strong> from this module.
                            This action cannot be undone.
                        </p>
                        <div className={styles.dialogActions}>
                            <button
                                className={styles.dialogCancel}
                                onClick={() => setShowRemoveAllDialog(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.dialogConfirm}
                                onClick={handleRemoveAll}
                            >
                                Yes, Remove All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.searchSection}>
                <div className={styles.searchBox}>
                    <Search className={styles.searchIcon} size={18} />
                    <input
                        type="text"
                        placeholder={isFull ? "Module is full" : "Search students by name or email..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                        disabled={isFull}
                    />
                    {loading && <div className={styles.loader}></div>}
                </div>

                {searchResults.length > 0 && searchQuery.length > 0 && !isFull && (
                    <div className={styles.resultsPopup}>
                        {searchResults.map((student) => (
                            <div
                                key={student.id}
                                className={styles.resultItem}
                                onClick={() => handleEnroll(student.id)}
                            >
                                <div className={styles.userInfo}>
                                    <p className={styles.userName}>{student.user.name}</p>
                                    <p className={styles.userEmail}>{student.user.email}</p>
                                </div>
                                <button className={styles.addBtn}>
                                    <UserPlus size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>Enrolled At</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {module.students && module.students.length > 0 ? (
                            module.students.map((student) => (
                                <tr key={student.id}>
                                    <td>
                                        <div className={styles.userInfo}>
                                            <p className={styles.userName}>{student.user.name}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <p className={styles.userEmail}>{student.user.email}</p>
                                    </td>
                                    <td>
                                        {new Date(student.pivot.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles.statusActive}`}>
                                            {student.pivot.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className={styles.actionBtnDelete}
                                            onClick={() => handleDelete(student.pivot.id)}
                                            title="Remove Student"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
                                    No students enrolled yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
