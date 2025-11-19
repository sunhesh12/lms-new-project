import GuestLayout from "@/Layouts/GuestLayout";
import styles from "@/css/module.module.css";
import Topic from "@/components/Topic";
import ModuleHeader from "@/components/ModuleHeader";
import ModuleToolbar from "@/components/ModuleToolbar";
import { useState } from "react";
import TopicForm from "@/components/TopicForm";
import FloatingWindowContainer from "@/components/FloatingWindowContainer";
import AssignmentForm from "@/components/AssignmentForm";

export default function ModuleMain({ moduleId }) {
    // Tracking the visibility of all the floating forms
    const [topicFormVisible, setTopicFormVisible] = useState(false);
    const [assignmentFormVisible, setAssignmentFormVisible] = useState(false);

    return (
        <GuestLayout>
            {topicFormVisible && (
                <FloatingWindowContainer
                    closeAction={() => {
                        setTopicFormVisible(false);
                    }}
                >
                    <TopicForm />
                </FloatingWindowContainer>
            )}

            {assignmentFormVisible && (
                <FloatingWindowContainer
                    closeAction={() => {
                        setAssignmentFormVisible(false);
                    }}
                >
                    <AssignmentForm />
                </FloatingWindowContainer>
            )}
            <ModuleHeader
                moduleName={`Module ${moduleId}`}
                subTitle="Module subtitle"
                coverImage="/images/default-cover.webp"
            />
            <div id="module-content" className={styles.moduleContent}>
                <ModuleToolbar
                    onTopicCreate={() => {
                        setTopicFormVisible(true);
                    }}

                    onAssignmentCreate={() => {
                        setAssignmentFormVisible(true);
                    }}
                />
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
