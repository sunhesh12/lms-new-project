import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import {
    User,
    Mail,
    MapPin,
    Phone,
    Calendar,
    Shield,
    ChevronLeft,
    BookOpen,
    Clock,
    UserCircle
} from "lucide-react";
import styles from "./css/edit.module.css";
import PrimaryButton from "@/components/PrimaryButton";
import InputLabel from "@/components/Input/InputLabel";
import TextInput from "@/components/Input/TextInput";

export default function Edit({ managedUser }) {
    const { data, setData, put, processing, errors } = useForm({
        name: managedUser.name || "",
        email: managedUser.email || "",
        address: managedUser.address || "",
        user_phone_no: managedUser.user_phone_no || "",
        user_dob: managedUser.user_dob || "",
        status: managedUser.status || "active",
        role: managedUser.role || "student",
        can_upload_feed: managedUser.can_upload_feed ?? true,
        upload_blocked_until: managedUser.upload_blocked_until || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', managedUser.id));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className={styles.pageHeader}>Edit User Detailed</h2>}
        >
            <Head title={`Edit User - ${managedUser.name}`} />

            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleGroup}>
                        <Link href={route('admin.users.index')} className={styles.backBtn}>
                            <ChevronLeft size={20} />
                            Back to Users
                        </Link>
                        <h1 className={styles.title}>User Management Console</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className={styles.grid}>
                    {/* Left Column: Avatar & Account Status */}
                    <div className={styles.leftColumn}>
                        <div className={styles.card}>
                            <div className={styles.sectionTitle}>
                                <UserCircle size={20} className={styles.titleIcon} />
                                Account Overview
                            </div>

                            <div className={styles.profileOverview}>
                                <img
                                    src={managedUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(managedUser.name)}&background=random`}
                                    className={styles.avatarLarge}
                                    alt={managedUser.name}
                                />
                                <h3 className={styles.userNameDisplay}>{managedUser.name}</h3>
                                <p className={styles.userEmailDisplay}>{managedUser.email}</p>
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.inputGroup}>
                                    <InputLabel value="Account Status" className={styles.label} />
                                    <select
                                        className={styles.select}
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="blocked">Blocked</option>
                                    </select>
                                </div>

                                <div className={styles.inputGroup}>
                                    <InputLabel value="System Role" className={styles.label} />
                                    <select
                                        className={styles.select}
                                        value={data.role}
                                        onChange={e => setData('role', e.target.value)}
                                    >
                                        <option value="student">Student</option>
                                        <option value="lecturer">Lecturer</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </div>
                                <div className={styles.inputGroup}>
                                    <InputLabel value="Can Upload To Feed" className={styles.label} />
                                    <select
                                        className={styles.select}
                                        value={data.can_upload_feed ? '1' : '0'}
                                        onChange={e => setData('can_upload_feed', e.target.value === '1')}
                                    >
                                        <option value="1">Allowed</option>
                                        <option value="0">Blocked Permanently</option>
                                    </select>
                                </div>
                                <div className={styles.inputGroup}>
                                    <InputLabel value="Block Uploads Until (optional)" className={styles.label} />
                                    <input
                                        type="datetime-local"
                                        className={styles.select}
                                        value={data.upload_blocked_until}
                                        onChange={e => setData('upload_blocked_until', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Detailed Form & Academic Record */}
                    <div className={styles.rightColumn}>
                        <div className={styles.card}>
                            <div className={styles.sectionTitle}>
                                <Shield size={20} className={styles.titleIcon} />
                                Personal Information
                            </div>

                            <div className={styles.formGrid2}>
                                <div className={styles.inputGroup}>
                                    <TextInput
                                        label="Full Name"
                                        className={styles.input}
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        error={errors.name}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <TextInput
                                        label="Email Address"
                                        className={styles.input}
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        error={errors.email}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <TextInput
                                        label="Phone Number"
                                        className={styles.input}
                                        value={data.user_phone_no}
                                        onChange={e => setData('user_phone_no', e.target.value)}
                                        error={errors.user_phone_no}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <TextInput
                                        label="Date of Birth"
                                        type="date"
                                        className={styles.input}
                                        value={data.user_dob}
                                        onChange={e => setData('user_dob', e.target.value)}
                                        error={errors.user_dob}
                                    />
                                </div>

                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <TextInput
                                        label="Physical Address"
                                        type="textarea"
                                        className={styles.input}
                                        style={{ minHeight: '100px' }}
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        error={errors.address}
                                    />
                                </div>
                            </div>

                            <div className={styles.actions}>
                                <PrimaryButton className={styles.saveBtn} disabled={processing}>
                                    Save Changes
                                </PrimaryButton>
                            </div>
                        </div>

                        {/* Academic / Enrollment Overview */}
                        <div className={`${styles.card} ${styles.marginTop}`}>
                            <div className={styles.sectionTitle}>
                                <BookOpen size={20} className={styles.titleIcon} />
                                Academic Overview (Enrolled Modules)
                            </div>

                            {managedUser.enrolled_modules && managedUser.enrolled_modules.length > 0 ? (
                                <table className={styles.enrollmentTable}>
                                    <thead>
                                        <tr>
                                            <th>Module</th>
                                            <th>Status</th>
                                            <th>Enrolled Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {managedUser.enrolled_modules.map((module) => (
                                            <tr key={module.id}>
                                                <td>
                                                    <div className={styles.moduleInfo}>
                                                        <span className={styles.moduleName}>{module.name}</span>
                                                        <span className={styles.moduleCode}>{module.code}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`${styles.statusBadge} ${styles['status-' + (module.status || 'enrolled').toLowerCase()]}`}>
                                                        {module.status || 'Enrolled'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className={styles.dateInfo}>
                                                        <Clock size={14} />
                                                        {module.enrolled_at}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className={styles.emptyState}>
                                    <BookOpen size={48} className={styles.emptyIcon} />
                                    <p>No module enrollments found for this user.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
