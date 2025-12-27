import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import styles from '@/css/components/grading.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faSave, faArrowLeft, faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useForm, Link } from '@inertiajs/react';

export default function GradingMain({ module, assignment, students }) {
    // Helper to get initials
    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    // Stats
    const totalStudents = students.length;
    const submittedCount = students.filter(s => s.submission).length;
    const gradedCount = students.filter(s => s.submission && s.submission.grade !== null).length;

    return (
        <AuthenticatedLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <Link href={route('module.show', module.id)} className="text-gray-500 hover:text-gray-700 mb-2 inline-block">
                            <FontAwesomeIcon icon={faArrowLeft} /> Back to Module
                        </Link>
                        <h1 className={styles.title}>Grading: {assignment.title}</h1>
                        <p className={styles.subtitle}>{module.name}</p>
                    </div>
                    <div className={styles.stats}>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{submittedCount}/{totalStudents}</div>
                            <div className={styles.statLabel}>Submitted</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{gradedCount}</div>
                            <div className={styles.statLabel}>Graded</div>
                        </div>
                    </div>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Status</th>
                                <th>Submission</th>
                                <th>Grade (0-100)</th>
                                <th>Feedback</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <StudentRow key={student.id} student={student} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StudentRow({ student }) {
    const submission = student.submission;
    const { data, setData, post, processing, wasSuccessful } = useForm({
        grade: submission?.grade || '',
        feedback: submission?.feedback || '',
    });

    const isLate = submission ? new Date(submission.created_at) > new Date(student.submission?.deadline) : false; // Deadline logic usually in assignment, not submission, wait. Assignment deadline is global.
    // For simplicity, we just check existence.

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!submission) return;
        post(route('assignment.grade.store', submission.id), {
            preserveScroll: true,
        });
    };

    return (
        <tr>
            <td>
                <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                        {getInitials(student.name)}
                    </div>
                    <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-xs text-gray-500">{student.id}</div>
                    </div>
                </div>
            </td>
            <td>
                {submission ? (
                    <span className={styles.statusSubmitted}>
                        <FontAwesomeIcon icon={faCheckCircle} /> Submitted
                        <div className="text-xs text-gray-400">{new Date(submission.created_at).toLocaleDateString()}</div>
                    </span>
                ) : (
                    <span className={styles.notSubmitted}>
                        Pending
                    </span>
                )}
            </td>
            <td>
                {submission ? (
                    <a href={`/storage/uploads/submissions/${submission.file_url}`} target="_blank" className={styles.fileLink}>
                        <FontAwesomeIcon icon={faFile} /> View File
                    </a>
                ) : (
                    <span className="text-gray-400">-</span>
                )}
            </td>
            <td>
                {submission ? (
                    <input
                        type="number"
                        min="0"
                        max="100"
                        className={styles.gradeInput}
                        value={data.grade}
                        onChange={e => setData('grade', e.target.value)}
                    />
                ) : (
                    '-'
                )}
            </td>
            <td>
                {submission ? (
                    <textarea
                        className={styles.feedbackInput}
                        placeholder="Enter feedback..."
                        value={data.feedback}
                        onChange={e => setData('feedback', e.target.value)}
                    />
                ) : (
                    '-'
                )}
            </td>
            <td>
                {submission && (
                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className={styles.saveBtn}
                    >
                        <FontAwesomeIcon icon={faSave} /> {processing ? '...' : 'Save'}
                    </button>
                )}
            </td>
        </tr>
    );
}
