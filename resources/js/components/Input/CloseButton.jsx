import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./css/close-button.module.css";

export default function CloseButton({ closeAction }) {
    return (
        <button className={styles.closeButton} onClick={() => closeAction()}>
            <FontAwesomeIcon icon={faClose} />
        </button>
    );
}
