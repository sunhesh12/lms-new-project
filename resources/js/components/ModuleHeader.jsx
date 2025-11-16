import Shade from "@/components/Shade";
import styles from "@/css/modules.module.css";

export default function ModuleHeader({moduleName, subTitle, coverImage}) {
    return (
        <header id="module-header" className={styles.moduleHeader}>
            <div id="module-cover" className={styles.moduleCoverContainer}>
                <img
                    className={styles.coverImage}
                    src={coverImage}
                />
            </div>
            <div id="module-info" className={styles.moduleInfo}>
                <h1>{moduleName}</h1>
                <p>{subTitle}</p>
            </div>
            <Shade height="300px" />
        </header>
    );
}
