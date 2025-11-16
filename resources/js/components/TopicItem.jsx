import styles from "@/css/components/topic-item.module.css";
import FileInfoChip from "@/components/FileInfoChip";

export default function TopicItem({itemName, fileIcon, fileName}) {
    return (
        <li id="item">
            <div id="item-content" className={styles.itemContent}>
                <span>{itemName}</span>
                <FileInfoChip fileIcon={fileIcon} fileName={fileName} />
            </div>
        </li>
    );
}
