import styles from "@/css/components/shade.module.css";

export default function Shade({height}) {
    return <div className={styles.shade} style={{ height: height ? height : "300px" }}></div>;
}
