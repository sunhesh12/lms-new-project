import { useState } from "react";
import styles from "@/css/components/enrollments.module.css";
import { faPlus, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Table from "@/components/Tables/Table";
import Button from "@/components/Input/Button";

import { router } from "@inertiajs/react";
import axios from "axios";

export default function Enrollments({ module }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await axios.get(route('students.search', { query }));
            setSearchResults(response.data);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsSearching(false);
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

    const columns = [
        {
            accessor: "name",
            label: "Student Name",
            render: (row) => row.user.name,
        },
        {
            accessor: "email",
            label: "Email",
            render: (row) => row.user.email,
        },
        {
            accessor: "registration_date",
            label: "Enrolled At",
            render: (row) => new Date(row.pivot.created_at).toLocaleDateString(),
        },
        {
            accessor: "status",
            label: "Status",
            render: (row) => (
                <span className={`${styles.statusBadge} ${styles.statusActive}`}>
                    {row.pivot.status}
                </span>
            ),
        },
        {
            accessor: "actions",
            label: "Actions",
            render: (row) => (
                <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => handleDelete(row.pivot.id)}
                    title="Remove Student"
                >
                    🗑
                </button>
            ),
        },
    ];

    return (
        <div className={styles.enrollments}>
            <header>
                <h2>
                    <span>
                        <FontAwesomeIcon icon={faUser} />
                    </span>{" "}
                    <span>Enrollments for {module.name}</span>
                </h2>
            </header>
            <p>Search and enroll students for this module.</p>

            <div className={styles.searchWrapper}>
                <input
                    type="text"
                    placeholder="Search students by name or email..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className={styles.searchInput}
                />

                {searchResults.length > 0 && (
                    <div className={styles.resultsPopup}>
                        {searchResults.map((student) => (
                            <div
                                key={student.id}
                                className={styles.resultItem}
                                onClick={() => handleEnroll(student.id)}
                            >
                                <div className={styles.resultInfo}>
                                    <div className={styles.name}>{student.user.name}</div>
                                    <div className={styles.email}>{student.user.email}</div>
                                </div>
                                <Button size="small" icon={faPlus}>Enroll</Button>
                            </div>
                        ))}
                    </div>
                )}

                {isSearching && (
                    <div className={styles.searchingIndicator}>Searching...</div>
                )}
            </div>

            <Table
                columns={columns}
                data={module.students || []}
            />
        </div>
    );
}
