import { useState } from "react";
import styles from "@/css/components/text-input.module.css";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TextInput({ className, label, error, icon, ...props }) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    return (
        <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor={props.name}>
                <span>{label}</span>
                <span>{error}</span>
            </label>
            <div className={styles.inputWrapper}>
                {icon && <FontAwesomeIcon icon={icon} />}
                <input
                    {...props}
                    type={
                        props.type === "password"
                            ? isPasswordVisible
                                ? "text"
                                : "password"
                            : props.type
                    }
                    className={className + " " + styles.input}
                />
                {props.type === "password" && (
                    <div className={styles.eye}>
                        {isPasswordVisible ? (
                            <FontAwesomeIcon
                                icon={faEyeSlash}
                                onClick={() => {
                                    setIsPasswordVisible(!isPasswordVisible);
                                }}
                            />
                        ) : (
                            <FontAwesomeIcon
                                icon={faEye}
                                onClick={() => {
                                    setIsPasswordVisible(!isPasswordVisible);
                                }}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
