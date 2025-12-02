import styles from "@/css/components/topic-item.module.css";
import FileInfoChip from "@/components/FileInfoChip";
import { Link } from "@inertiajs/react";

export default function ChipLink({ fileIcon, fileName, url }) {
    return (
        <div id="item-content" className={styles.itemContent}>
            <Link href={url}>
                <FileInfoChip fileIcon={fileIcon} fileName={fileName} />
            </Link>
        </div>
    );
}
