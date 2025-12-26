import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ItemList from "@/components/Lists/ItemList";
import {
    faAngleDown,
    faAngleUp,
    faBookOpen,
    faEdit,
    faFile,
    faTrashCan,
    faUpload,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./css/topic.module.css";
import Button from "../Input/Button";
import LinkChip from "../Links/LinkChip";

export default function Topic({
    topicName,
    description,
    formToggle,
    resources,
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
                            <Button backgroundColor="delete" icon={faTrashCan}>
                                Delete Topic
                            </Button>
                        )}
                    </div>
                    <p>{description}</p>
                    <ItemList
                        items={resources}
                        render={({ id, url, caption }) => (
                            <div
                                className={styles.topicItemContent}
                                key={id ?? ""}
                            >
                                <span>{caption}</span>
                                <LinkChip
                                    fileIcon={faFile}
                                    url={url}
                                    fileName={url.split("/").at(-1)}
                                />
                            </div>
                        )}
                        fallback={() => {
                            return <div>No resources available</div>;
                        }}
                    />
                </div>
            )}
        </section>
    );
}
