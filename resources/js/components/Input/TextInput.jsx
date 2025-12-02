import { useState } from "react";
import styles from "./css/text-input.module.css";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TextInput({
    className = "",
    label,
    error,
    icon,
    ...props
}) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <div className={styles.inputContainer}>
            {/* Label + Error */}
            <label className={styles.label} htmlFor={props.id || props.name}>
                <span>{label}</span>
                {error && <span className={styles.errorText}>{error}</span>}
            </label>

            {props.type === "textarea" ? (
                <div
                    className={`${styles.inputWrapper} ${
                        error ? styles.inputErrorBorder : ""
                    
                    }`}
                >
                    <textarea
                        {...props}
                        className={`${styles.input} ${className}`}
                    ></textarea>
                </div>
            ) : (
                <div
                    className={`${styles.inputWrapper} ${
                        error ? styles.inputErrorBorder : ""
                    }`}
                >
                    {icon && (
                        <FontAwesomeIcon icon={icon} className={styles.icon} />
                    )}

                    <input
                        {...props}
                        type={
                            props.type === "password"
                                ? isPasswordVisible
                                    ? "text"
                                    : "password"
                                : props.type
                        }
                        className={`${styles.input} ${className}`}
                    />

                    {/* Password Eye Icon */}
                    {props.type === "password" && (
                        <div className={styles.eye}>
                            <FontAwesomeIcon
                                icon={isPasswordVisible ? faEyeSlash : faEye}
                                onClick={() =>
                                    setIsPasswordVisible(!isPasswordVisible)
                                }
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
