import { Link } from "@inertiajs/react"
import styles from "./css/link.module.css";

export default function CustomLink({ children, className, href }) {
    return (
        <Link className={styles.link + " " + className} href={href}>{children}</Link>
    )
}