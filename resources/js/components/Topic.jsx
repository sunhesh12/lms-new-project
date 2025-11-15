import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TopicItemList from "@/components/TopicItemList";
import {
    faAngleDown,
    faAngleUp,
    faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import styles from "@/css/components/topic.module.css";


export default function Topic() {
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
                    <p className={styles.topicName}>Topic name goes here</p>
                </div>
                <div id="icon-container" className={styles.collapse}>
                    <FontAwesomeIcon
                        icon={expanded ? faAngleUp : faAngleDown}
                    />
                </div>
            </div>
            {expanded && (
                <div id="expanded-content" className={styles.expandedContent}>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed eget sapien nec mauris scelerisque mollis vel ac
                        metus. Etiam vel.
                    </p>
                    <TopicItemList />
                </div>
            )}
        </section>
    );
}
