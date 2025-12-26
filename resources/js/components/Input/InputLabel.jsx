import styles from "./css/input-label.module.css";

export default function InputLabel({
    label,
    htmlFor,
    error
}) {
    return (
        <label className={styles.label} htmlFor={htmlFor}>
                <span>{label}</span>
                {error && <span className={styles.errorText}>{error}</span>}
        </label>
    );
}
