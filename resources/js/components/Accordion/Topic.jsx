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
} from "@fortawesome/free-solid-svg-icons";
import styles from "@/css/components/topic.module.css";
import Button from "../Input/Button";
import LinkChip from "../Links/LinkChip";

export default function Topic({ topicName, description, formToggle }) {
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
                            icon={faEdit}
                            onClick={() => {
                                formToggle();
                            }}
                        >
                            Edit Topic
                        </Button>
                        <Button backgroundColor="#880808" icon={faTrashCan}>
                            Delete Topic
                        </Button>
                    </div>
                    <p>{description}</p>
                    <ItemList
                        items={[
                            {
                                caption: "Use this resource",
                                fileIcon: faFile,
                                fileName: "Test URL",
                                url: "http://www.testingmcafeesites.com/index.html",
                            },
                            {
                                caption: "Use this resource",
                                fileIcon: faFile,
                                fileName: "Test URL",
                                url: "http://www.testingmcafeesites.com/index.html",
                            },
                            {
                                caption: "Use this resource",
                                fileIcon: faFile,
                                fileName: "Test URL",
                                url: "http://www.testingmcafeesites.com/index.html",
                            },
                            {
                                caption: "Use this resource",
                                fileIcon: faFile,
                                fileName: "Test URL",
                                url: "http://www.testingmcafeesites.com/index.html",
                            },
                            {
                                caption: "Use this resource",
                                fileIcon: faFile,
                                fileName: "Test URL",
                                url: "http://www.testingmcafeesites.com/index.html",
                            },
                            {
                                caption: "Use this resource",
                                fileIcon: faFile,
                                fileName: "Test URL",
                                url: "http://www.testingmcafeesites.com/index.html",
                            },
                        ]}
                        render={({ fileIcon, fileName, url, caption }) => (
                            <div className={styles.topicItemContent}>
                                <span>{caption}</span>
                                <LinkChip
                                    fileIcon={fileIcon}
                                    url={url}
                                    fileName={fileName}
                                />
                            </div>
                        )}
                    />
                </div>
            )}
        </section>
    );
}
