import { Link } from "@inertiajs/react";
import styles from "@/css/components/button.module.css";

export default function Button({ children, href }) {
    if (href) {
        return <Link className={styles.button} href={href}>{children}</Link>;
    }

    return <button className={styles.button}>{children}</button>;
}
