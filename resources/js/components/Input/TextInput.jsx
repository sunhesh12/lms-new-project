import styles from "@/css/components/text-input.module.css";

export default function TextInput({ className, label, error, ...props }) {
  return (
    <div className={styles.inputContainer}>
        <label className={styles.label} htmlFor={props.name}>
            <span>{label}</span>
            <span>{error}</span>
        </label>
        <input className={`${styles.input} ${className}`} {...props} />
    </div>
  );
}