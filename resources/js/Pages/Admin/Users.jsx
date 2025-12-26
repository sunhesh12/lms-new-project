import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { UserCog } from "lucide-react";
import styles from "@/css/admin.module.css";
import Table from "@/components/Tables/Table";

export default function Users({ users }) {
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

    const columns = [
        {
            accessor: "name",
            label: "User Name",
            render: (row) => (
                <div className={styles.userInfo}>
                    <div className={styles.userAvatar}>
                        {row.name[0]}
                    </div>
                    <span className={styles.userName}>{row.name}</span>
                </div>
            ),
        },
        { accessor: "email", label: "Email" },
        {
            accessor: "role",
            label: "Role",
            render: (row) => (
                <span className={styles.roleBadge}>
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
                    <h1 className={`${styles.title} ${styles.titleGroup}`}>
                        <UserCog size={32} className={styles.titleIcon} />
                        Manage System Users
                    </h1>
                    <p className={styles.subtitle}>Update user roles and access levels.</p>
                </header>

                <div className={styles.tableCard}>
                    <Table
                        columns={columns}
                        data={users}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
