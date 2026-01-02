import styles from "./css/input-label.module.css";

export default function InputLabel({
    label,
    value,
    htmlFor,
    error,
    children,
    className = "",
    ...props
}) {
    return (
        <label
            {...props}
            className={`${styles.label} ${className}`}
            htmlFor={htmlFor}
        >
            <span>{value || label || children}</span>
            {error && <span className={styles.errorText}>{error}</span>}
        </label>
    );
}

