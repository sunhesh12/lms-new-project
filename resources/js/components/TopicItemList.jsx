import styles from "@/css/components/topic-item-list.module.css";
import TopicItem from "@/components/TopicItem";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

export default function TopicItemList() {
    return (
        <div id="topic-item-list" className={styles.topicItemContainer}>
            <div id="vertical-line" className={styles.verticalLine}></div>
            <ul id="item-list" className={styles.itemList}>
                <TopicItem
                    fileIcon={faFilePdf}
                    itemName="Lecture note for the last lecture"
                    fileName="Lecture note 01.pdf"
                />
                <TopicItem
                    fileIcon={faFilePdf}
                    itemName="Lecture note for the last lecture"
                    fileName="Lecture note 01.pdf"
                />
                <TopicItem
                    fileIcon={faFilePdf}
                    itemName="Lecture note for the last lecture"
                    fileName="Lecture note 01.pdf"
                />
                <TopicItem
                    fileIcon={faFilePdf}
                    itemName="Lecture note for the last lecture"
                    fileName="Lecture note 01.pdf"
                />
                <TopicItem
                    fileIcon={faFilePdf}
                    itemName="Lecture note for the last lecture"
                    fileName="Lecture note 01.pdf"
                />
                <TopicItem
                    fileIcon={faFilePdf}
                    itemName="Lecture note for the last lecture"
                    fileName="Lecture note 01.pdf"
                />
                <TopicItem
                    fileIcon={faFilePdf}
                    itemName="Lecture note for the last lecture"
                    fileName="Lecture note 01.pdf"
                />
            </ul>
        </div>
    );
}
