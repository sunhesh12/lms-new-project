import styles from "@/css/components/card.module.css";

export default function Card({ children, rowLayout }) {
    return (
        <div
            id="card"
            className={styles.card}
            styles={rowLayout && { flexDirection: rowLayout === "row" ? "row" : "column" }}
        >
            {children}
        </div>
    );
}
