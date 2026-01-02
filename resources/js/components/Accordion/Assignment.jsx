import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faAngleUp,
    faClock,
    faEdit,
    faUpload,
    faTrashCan,
    faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./css/topic.module.css";
import Button from "../Input/Button";
import ResourceViewer from "../Resource/ResourceViewer";
import { Link } from "@inertiajs/react";

export default function Assignment({
    assignment,
    isModuleStaff,
    moduleId,
    onEdit,
    onDelete,
    onGrading,
}) {
    const [expanded, setExpanded] = useState(false);
    
    const now = new Date();
    const startDate = new Date(assignment.started);
    const deadline = new Date(assignment.deadline);
    const isActive = now >= startDate && now <= deadline;
    const isPastDeadline = now > deadline;
    const hasStarted = now >= startDate;

    // Get submission info if available
    const submission = assignment.submissions && assignment.submissions.length > 0 
        ? assignment.submissions[0] 
        : null;

    return (
        <section id="assignment" className={styles.topic}>
            <div
                id="collapsed-content"
                onClick={() => {
                    setExpanded(!expanded);
                }}
                className={styles.collapseContent}
            >
                <div id="assignment-icon-container">
                    <FontAwesomeIcon icon={faClock} size="2x" />
                </div>
                <div id="assignment-name-container">
                    <p className={styles.topicName}>{assignment.title}</p>
                    <div style={{ 
                        fontSize: '0.85rem', 
                        color: '#64748b',
                        marginTop: '0.25rem',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center'
                    }}>
                        <span>
                            Due: {deadline.toLocaleDateString()} {deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isActive && hasStarted && (
                            <span style={{ color: '#16a34a', fontWeight: '600' }}>● Open</span>
                        )}
                        {isPastDeadline && (
                            <span style={{ color: '#dc2626', fontWeight: '600' }}>● Closed</span>
                        )}
                        {!hasStarted && (
                            <span style={{ color: '#f59e0b', fontWeight: '600' }}>● Not Started</span>
                        )}
                    </div>
                </div>
                <div id="icon-container" className={styles.collapse}>
                    <FontAwesomeIcon
                        icon={expanded ? faAngleUp : faAngleDown}
                    />
                </div>
            </div>
            {expanded && (
                <div id="expanded-content" className={styles.expandedContent}>
                    <div id="assignment-toolbar" className={styles.topicToolbar}>
                        {isModuleStaff ? (
                            <>
                                <Button
                                    icon={faEdit}
                                    onClick={() => {
                                        onEdit(assignment);
                                    }}
                                >
                                    Edit Assignment
                                </Button>
                                <Link
                                    href={route('assignment.grading', [moduleId, assignment.id])}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <Button icon={faClipboardList}>
                                        Grade
                                    </Button>
                                </Link>
                                <Button 
                                    backgroundColor="delete" 
                                    icon={faTrashCan}
                                    onClick={() => {
                                        if (onDelete) onDelete(assignment);
                                    }}
                                >
                                    Delete Assignment
                                </Button>
                            </>
                        ) : (
                            <Button
                                icon={faUpload}
                                onClick={() => {
                                    onEdit(assignment);
                                }}
                            >
                                {submission ? 'Resubmit' : 'Submit Assignment'}
                            </Button>
                        )}
                    </div>
                    
                    <p style={{ marginBottom: '1rem', color: '#475569' }}>
                        {assignment.description || 'No description provided.'}
                    </p>

                    {/* Assignment Dates */}
                    <div style={{ 
                        marginBottom: '1rem', 
                        padding: '0.75rem', 
                        background: '#f8fafc', 
                        borderRadius: '0.5rem', 
                        border: '1px solid #e2e8f0' 
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>Start Date:</span>
                                <span style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                                    {startDate.toLocaleDateString()} {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>Deadline:</span>
                                <span style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                                    {deadline.toLocaleDateString()} {deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Student Submission Status and Grade Display */}
                    {!isModuleStaff && submission && (
                        <div style={{ 
                            marginBottom: '1rem', 
                            padding: '0.75rem', 
                            background: '#f0fdf4', 
                            borderRadius: '0.5rem', 
                            border: '1px solid #bbf7d0' 
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>Status:</span>
                                <span style={{ fontSize: '0.9rem', color: '#16a34a', fontWeight: '600' }}>
                                    ✓ Submitted {new Date(submission.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            {submission.grade !== null && (
                                <>
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center', 
                                        marginBottom: submission.feedback ? '0.5rem' : '0', 
                                        paddingTop: '0.5rem', 
                                        borderTop: '1px solid #bbf7d0' 
                                    }}>
                                        <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>Grade:</span>
                                        <span style={{
                                            fontWeight: '700',
                                            color: submission.grade >= 50 ? '#16a34a' : '#dc2626',
                                            fontSize: '1.1rem'
                                        }}>
                                            {submission.grade}/100
                                        </span>
                                    </div>
                                    {submission.feedback && (
                                        <div style={{ 
                                            fontSize: '0.9rem', 
                                            color: '#475569', 
                                            borderTop: '1px solid #bbf7d0', 
                                            paddingTop: '0.5rem', 
                                            marginTop: '0.5rem' 
                                        }}>
                                            <strong>Feedback:</strong> {submission.feedback}
                                        </div>
                                    )}
                                </>
                            )}
                            
                            {/* Display submission resource if available */}
                            {submission.resource && !submission.resource.is_deleted && (
                                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #bbf7d0' }}>
                                    <h5 style={{ 
                                        fontSize: '0.9rem', 
                                        fontWeight: '600', 
                                        marginBottom: '0.5rem', 
                                        color: '#1e293b' 
                                    }}>
                                        Your Submission
                                    </h5>
                                    <ResourceViewer
                                        resource={submission.resource}
                                        basePath="/storage/uploads/submissions"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Assignment Resources */}
                    {assignment.resources && assignment.resources.length > 0 && (
                        <div className={styles.resourcesContainer}>
                            <h4 style={{ 
                                fontSize: '1rem', 
                                fontWeight: '600', 
                                marginBottom: '0.75rem', 
                                color: '#1e293b' 
                            }}>
                                Resources
                            </h4>
                            {assignment.resources
                                .filter(resource => !resource.is_deleted)
                                .map((resource) => (
                                    <ResourceViewer
                                        key={resource.id}
                                        resource={resource}
                                        basePath="/storage/uploads/resources"
                                    />
                                ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

