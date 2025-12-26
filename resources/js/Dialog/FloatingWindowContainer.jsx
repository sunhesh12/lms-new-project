import styles from "./css/floating-window-container.module.css";
import CloseButton from "../components/Input/CloseButton";

export default function FloatingWindowContainer({
    children,
    closeAction,
}) {

    return (
        <div id="float-container" className={styles.floatContainer}>
            <div
                id="form-container"
                className={styles.formContainer}
            >
                <CloseButton
                    closeAction={() => {
                        closeAction();
                    }}
                />
                {children}
            </div>
        </div>
    );
}
