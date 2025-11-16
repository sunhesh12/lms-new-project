import styles from "@/css/components/upload-box.module.css"
import { faCloudUpload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function UploadBox() {
    return (
        <div id="upload-box" className={styles.uploadBox}>
            <div id="cloud-holder" className={styles.cloudHolder}>
                <FontAwesomeIcon size="5x" icon={faCloudUpload} />
            </div>
            <h2>Upload your submission</h2>
            <p>Click to upload the document or drag and drop the document</p>
        </div>
    )
}