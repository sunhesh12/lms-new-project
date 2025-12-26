import styles from "./css/file-info-chip.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FileInfoChip({ fileIcon, fileName }) {
    return (
        <div id="file-info-chip" className={styles.fileInfoChip}>
            <div id="file-type-icon-container">
                <FontAwesomeIcon size="2x" icon={fileIcon} />
            </div>
            <div id="file-name-container">{fileName}</div>
        </div>
    );
}
