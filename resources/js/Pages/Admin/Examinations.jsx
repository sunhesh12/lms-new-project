import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { FileText, Search, Edit2, Calendar, Book } from "lucide-react";
import styles from "@/css/admin.module.css";
import Table from "@/components/Tables/Table";

export default function Examinations({ examinations }) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredExaminations = examinations.filter((item) => {
        const query = searchQuery.toLowerCase();
        return (
            item.title.toLowerCase().includes(query) ||
            item.module_name.toLowerCase().includes(query) ||
            item.type.toLowerCase().includes(query)
        );
    });

    const columns = [
        {
            accessor: "title",
            label: "Name",
            render: (row) => (
                <div className={styles.userInfo}>
                    <div className={`${styles.iconWrapper} ${row.type === 'Quiz' ? styles.iconOrange : styles.iconBlue}`} style={{ width: '32px', height: '32px', marginRight: '12px' }}>
                        <FileText size={16} />
                    </div>
                    <div>
                        <span className={styles.userName}>{row.title}</span>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{row.type}</p>
                    </div>
                </div>
            ),
        },
        {
            accessor: "module_name",
            label: "Module",
            render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Book size={14} color="#6b7280" />
                    <span>{row.module_name}</span>
                </div>
            ),
        },
        {
            accessor: "deadline",
            label: "Due Date",
            render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} color="#6b7280" />
                    <span>{row.deadline ? new Date(row.deadline).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : 'No Deadline'}</span>
                </div>
            ),
        },
        {
            accessor: "actions",
            label: "Actions",
            render: (row) => (
                <Link
                    href={row.edit_url}
                    className={styles.controlBtn}
                    style={{
                        padding: '6px 12px',
                        fontSize: '13px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#f3f4f6',
                        color: '#374151'
                    }}
                >
                    <Edit2 size={14} />
                    Edit
                </Link>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className={styles.pageHeader}>Examination Management</h2>}
        >
            <Head title="Examinations" />

            <div className={styles.adminContainer}>
                <header className={styles.header}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 className={`${styles.title} ${styles.titleGroup}`}>
                                <FileText size={32} className={styles.titleIcon} />
                                Manage Examinations
                            </h1>
                            <p className={styles.subtitle}>View and manage all active quizzes and assignments.</p>
                        </div>
                    </div>
                </header>

                <div className={styles.tableCard} style={{ marginTop: '20px' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                            <input
                                type="text"
                                placeholder="Search by name, module, or type..."
                                className={styles.roleSelect}
                                style={{ width: '100%', paddingLeft: '40px', height: '42px' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '14px' }}>
                            Showing {filteredExaminations.length} items
                        </div>
                    </div>

                    <Table
                        columns={columns}
                        data={filteredExaminations}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
