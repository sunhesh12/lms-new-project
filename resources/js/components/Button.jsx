import { Link } from "@inertiajs/react";
import styles from "@/css/components/button.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";

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
        const fontSize =
            size === "large" ? "1.25rem" : size === "small" ? "0.8rem" : "1rem";
        const bg = noBackground
            ? "transparent"
            : (backgroundColor
            ? backgroundColor
            : "var(--black)");
        const border = noBackground ? "2px solid var(--black)" : "none";
        const color = noBackground ? "var(--black)" : "white";

        return {
            fontSize,
            backgroundColor: bg,
            color,
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
