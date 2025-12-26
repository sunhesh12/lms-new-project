import { useState, useEffect } from "react";
import styles from "@/css/components/enrollments.module.css";
import { Search, UserPlus, Trash2 } from "lucide-react";
import { router } from "@inertiajs/react";
import axios from "axios";

export default function Enrollments({ module }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

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
            // Ensure endpoint handles empty query gracefully or returns top results
            const response = await axios.get(route('students.search', { query: query }));
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

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2 className={styles.title}>
                    Module Enrollments
                </h2>
                <p className={styles.subtitle}>Enroll students in {module.name}.</p>
            </header>

            <div className={styles.searchSection}>
                <div className={styles.searchBox}>
                    <Search className={styles.searchIcon} size={18} />
                    <input
                        type="text"
                        placeholder="Search students by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                    {loading && <div className={styles.loader}></div>}
                </div>

                {searchResults.length > 0 && searchQuery.length > 0 && (
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
                                <button className={styles.actionBtnDelete} style={{ color: 'var(--primary)', border: 'none' }}>
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
