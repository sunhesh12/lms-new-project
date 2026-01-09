import { Link } from "@inertiajs/react";
import styles from "./css/button.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";
import colors from "@/lib/colors";

export default function Button({
    children,
    href,
    icon,
    backgroundColor,
    noBackground,
    size,
    ...props
}) {
    const computedStyle = useMemo(() => {
        const bgColor = noBackground
            ? colors.transparent
            : backgroundColor === "primary"
                ? colors.black
                : backgroundColor === "secondary"
                    ? colors.blue
                    : backgroundColor === "tertiary"
                        ? colors.orange
                        : backgroundColor === "delete"
                            ? colors.red : backgroundColor === "white" ? colors.white
                                : colors.black;

        const fgColor = noBackground
            ? (backgroundColor === "primary"
                ? colors.black
                : backgroundColor === "secondary"
                    ? colors.blue
                    : backgroundColor === "tertiary"
                        ? colors.orange
                        : backgroundColor === "delete"
                            ? colors.red
                            : backgroundColor === "white" ? colors.white : colors.black)
            : backgroundColor === "primary"
                ? colors.white
                : backgroundColor === "secondary"
                    ? colors.white
                    : backgroundColor === "tertiary"
                        ? colors.black
                        : backgroundColor === "delete"
                            ? colors.white
                            : colors.white;

        const borderColor =
            backgroundColor === "primary"
                ? colors.black
                : backgroundColor === "secondary"
                    ? colors.blue
                    : backgroundColor === "tertiary"
                        ? colors.orange
                        : backgroundColor === "delete"
                            ? colors.red
                            : backgroundColor === "white" ? colors.white : colors.black;

        const fontSize =
            size === "large" ? "1.25rem" : size === "small" ? "0.8rem" : "1rem";
        const border = noBackground ? `2px solid ${borderColor}` : "none";

        return {
            fontSize,
            backgroundColor: bgColor,
            color: fgColor,
            border,
        };
    }, [noBackground, size]);

    if (href) {
        return (
            <Link
                className={styles.button}
                href={href}
                style={computedStyle}
                {...props}
            >
                {icon && <FontAwesomeIcon icon={icon} />}{" "}
                <span>{children}</span>
            </Link>
        );
    }

    return (
        <button className={styles.button} style={computedStyle} {...props}>
            {icon && <FontAwesomeIcon icon={icon} />} <span>{children}</span>
        </button>
    );
}
