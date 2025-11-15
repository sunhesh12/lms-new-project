import Shade from "@/components/Shade";
import GuestLayout from "@/Layouts/GuestLayout";
import styles from "@/css/modules.module.css";
import Topic from "@/components/Topic";

export default function ModuleMain() {
    return (
        <GuestLayout>
            <header id="module-header" className={styles.moduleHeader}>
                <div id="module-cover" className={styles.moduleCoverContainer}>
                    <img
                        className={styles.coverImage}
                        src="/images/default-cover.webp"
                    />
                </div>
                <div id="module-info" className={styles.moduleInfo}>
                    <h1>Module Name</h1>
                    <p>Some other info about the course</p>
                </div>
                <Shade height="300px" />
            </header>
            <div id="module-content" className={styles.moduleContent}>
                <h2>Module Content</h2>
                <article
                    id="topics-container"
                    className={styles.topicsContainer}
                >
                    <p>Pinned</p>
                    <section id="pinned"></section>
                    <Topic />
                    <Topic />
                </article>
            </div>
        </GuestLayout>
    );
}
