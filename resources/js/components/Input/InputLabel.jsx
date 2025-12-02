export default function InputLabel({
    value,
    className = '',
    children,
}) {
    return (
        <label className={styles.label} htmlFor={props.id || props.name}>
                <span>{label}</span>
                {error && <span className={styles.errorText}>{error}</span>}
            </label>
    );
}
