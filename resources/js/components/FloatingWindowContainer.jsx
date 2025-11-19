import styles from "@/css/components/floating-window-container.module.css";
import CloseButton from "./CloseButton";
import { useMemo } from "react";

export default function FloatingWindowContainer({
    children,
    closeAction,
    width,
    height,
}) {
    const computedStyles = useMemo(() => {
        width = width ? width : "50%";
        height = height ? height : "400px";
        return {
            width,
            minHeight: height,
        };
    }, [width, height]);

    return (
        <div id="float-container" className={styles.floatContainer}>
            <div
                id="form-container"
                style={computedStyles}
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
