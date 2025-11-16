import GuestLayout from "@/Layouts/GuestLayout";
import styles from "@/css/modules.module.css";
import Topic from "@/components/Topic";
import ModuleHeader from "@/components/ModuleHeader";
import ModuleToolbar from "@/components/ModuleToolbar";

export default function ModuleMain({ moduleId }) {
    return (
        <GuestLayout>
            <ModuleHeader
                moduleName={`Module ${moduleId}`}
                subTitle="Module subtitle"
                coverImage="/images/default-cover.webp"
            />
            <div id="module-content" className={styles.moduleContent}>
                <ModuleToolbar />
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
