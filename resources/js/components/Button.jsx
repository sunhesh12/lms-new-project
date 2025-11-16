import { Link } from "@inertiajs/react";
import styles from "@/css/components/button.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";

export default function Button({ children, href, icon, noBackground }) {
    const computedStyle = useMemo(() => {
        return noBackground
            ? {
                  background: "transparent",
                  color: "black",
                  border: "2px solid black",
              }
            : {
                  background: "black",
                  color: "white",
              };
    }, [noBackground]);

    if (href) {
        return (
            <Link className={styles.button} href={href} style={computedStyle}>
                {icon && <FontAwesomeIcon icon={icon} />}{" "}
                <span>{children}</span>
            </Link>
        );
    }

    return (
        <button className={styles.button} style={computedStyle}>
            {icon && <FontAwesomeIcon icon={icon} />} <span>{children}</span>
        </button>
    );
}
