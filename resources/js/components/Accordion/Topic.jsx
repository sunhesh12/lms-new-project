import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ItemList from "@/components/Lists/ItemList";
import {
    faAngleDown,
    faAngleUp,
    faBookOpen,
    faEdit,
    faTrashCan,
    faUpload,
    faClock,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./css/topic.module.css";
import Button from "../Input/Button";
import ResourceViewer from "../Resource/ResourceViewer";

export default function Topic({
    topicName,
    description,
    formToggle,
    resources,
    assignments = [],
    onAssignmentCreate,
    buttonText = "Edit Topic",
    isStudent = false,
}) {
    const [expanded, setExpanded] = useState(false);
    return (
        <section id="topic" className={styles.topic}>
            <div
                id="collaped-content"
                onClick={() => {
                    setExpanded(!expanded);
                }}
                className={styles.collapseContent}
            >
                <div id="topic-icon-container">
                    <FontAwesomeIcon icon={faBookOpen} size="2x" />
                </div>
                <div id="topic-name-container">
                    <p className={styles.topicName}>{topicName}</p>
                </div>
                <div id="icon-container" className={styles.collapse}>
                    <FontAwesomeIcon
                        icon={expanded ? faAngleUp : faAngleDown}
                    />
                </div>
            </div>
            {expanded && (
                <div id="expanded-content" className={styles.expandedContent}>
                    <div id="topic-toolbar" className={styles.topicToolbar}>
                        <Button
                            icon={isStudent ? faUpload : faEdit}
                            onClick={() => {
                                formToggle();
                            }}
                        >
                            {buttonText}
                        </Button>
                        {!isStudent && (
                            <>
                                <Button
                                    icon={faClock}
                                    onClick={() => onAssignmentCreate(null)} // null passed as topicId is handled by parent context usually, but here we want to modify Main to pass a handler that knows the topic ID. Actually, simpler: pass onAssignmentCreate which takes topicId.
                                >
                                    Add Assignment
                                </Button>
                                <Button backgroundColor="delete" icon={faTrashCan}>
                                    Delete Topic
                                </Button>
                            </>
                        )}
                    </div>
                    <p>{description}</p>

                    {/* Assignments Section */}
                    {assignments && assignments.length > 0 && (
                        <div className="mb-4">
                            <h4 className="font-semibold mb-2 text-gray-700">Assignments</h4>
                            <div className="flex flex-col gap-2">
                                {assignments.map(assignment => (
                                    <div key={assignment.id} className="bg-white p-3 rounded border border-gray-200 shadow-sm flex justify-between items-center">
                                        <div>
                                            <div className="font-medium text-blue-600">{assignment.title}</div>
                                            <div className="text-xs text-gray-500">Due: {new Date(assignment.deadline).toLocaleDateString()}</div>
                                        </div>
                                        {/* We can add a simple link or status here */}
                                        <div className="text-xs text-gray-500">
                                            {new Date() > new Date(assignment.deadline) ? 'Closed' : 'Open'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Resources Section with Rich Media */}
                    <div className={styles.resourcesContainer}>
                        {resources && resources.length > 0 ? (
                            resources
                                .filter(resource => !resource.is_deleted)
                                .map((resource) => (
                                    <ResourceViewer
                                        key={resource.id}
                                        resource={resource}
                                        basePath="/storage/uploads/resources"
                                    />
                                ))
                        ) : (
                            <div className="text-gray-400 italic" role="status" aria-live="polite">
                                No resources available
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
