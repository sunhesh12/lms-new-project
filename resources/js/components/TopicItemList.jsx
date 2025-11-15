import styles from "@/css/components/topic-item-list.module.css";

export default function TopicItemList() {
    return (
        <div id="topic-item-list" className={styles.topicItemContainer}>
            <div id="vertical-line" className={styles.verticalLine}></div>
            <ul id="item-list" className={styles.itemList}>
                <li id="item">
                    <div id="item-content">
                        Item content
                    </div>
                </li>
            </ul>
        </div>
    );
}
