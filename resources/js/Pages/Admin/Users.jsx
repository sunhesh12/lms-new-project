import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, Link } from "@inertiajs/react";
import { UserCog, Search, Edit3 } from "lucide-react";
import { useState } from "react";
import styles from "@/css/admin.module.css";
import Table from "@/components/Tables/Table";

export default function Users({ users }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleRoleUpdate = (userId, newRole) => {
        if (confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            router.post(route('admin.users.role.update', userId), {
                role: newRole
            });
        }
    };

    const handleStatusToggle = (userId, currentStatus) => {
        const action = currentStatus === 'active' ? 'block' : 'unblock';
        if (confirm(`Are you sure you want to ${action} this user?`)) {
            router.post(route('admin.users.status.toggle', userId));
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            accessor: "name",
            label: "User Name",
            render: (row) => (
                <div className={styles.userInfo}>
                    <img
                        src={row.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=random`}
                        className={styles.userAvatarSmall}
                        alt=""
                    />
                    <span className={styles.userName}>{row.name}</span>
                </div>
            ),
        },
        { accessor: "email", label: "Email" },
        {
            accessor: "role",
            label: "Role",
            render: (row) => (
                <span className={`${styles.roleBadge} ${styles['role-' + row.role]}`}>
                    {row.role}
                </span>
            ),
        },
        {
            accessor: "status",
            label: "Status",
            render: (row) => (
                <span className={`${styles.statusBadge} ${styles['status-' + row.status]}`}>
                    {row.status}
                </span>
            ),
        },
        {
            accessor: "actions",
            label: "Management",
            render: (row) => (
                <div className={styles.managementActions}>
                    <select
                        className={styles.roleSelect}
                        value={row.role}
                        onChange={(e) => handleRoleUpdate(row.id, e.target.value)}
                    >
                        <option value="student">Student</option>
                        <option value="lecturer">Lecturer</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button
                        onClick={() => handleStatusToggle(row.id, row.status)}
                        className={`${styles.toggleBtn} ${row.status === 'active' ? styles.blockBtn : styles.unblockBtn}`}
                    >
                        {row.status === 'active' ? 'Block' : 'Unblock'}
                    </button>

                    <Link
                        href={route('admin.users.edit', row.id)}
                        className={styles.editDetailBtn}
                        title="Detailed Edit"
                    >
                        <Edit3 size={18} />
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className={styles.pageHeader}>User Management</h2>}
        >
            <Head title="User Management" />

            <div className={styles.adminContainer}>
                <header className={styles.header}>
                    <div className={styles.titleSection}>
                        <h1 className={`${styles.title} ${styles.titleGroup}`}>
                            <UserCog size={32} className={styles.titleIcon} />
                            Manage System Users
                        </h1>
                        <p className={styles.subtitle}>Update user roles, status, and view detailed academic profiles.</p>
                    </div>

                    <div className={styles.searchContainer}>
                        <Search className={styles.searchIcon} size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email or role..."
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                <div className={styles.tableCard}>
                    <Table
                        columns={columns}
                        data={filteredUsers}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
