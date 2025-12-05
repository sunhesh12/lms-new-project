import GuestLayout from "@/Layouts/GuestLayout";
import styles from "@/css/module.module.css";
import Topic from "@/components/Accordion/Topic";
import ModuleHeader from "@/components/Module/ModuleHeader";
import ModuleToolbar from "@/components/Module/ModuleToolbar";
import { useRef, useState } from "react";
import TopicForm from "@/components/Forms/TopicForm";
import FloatingWindowContainer from "@/Dialog/FloatingWindowContainer";
import AssignmentForm from "@/components/Forms/AssignmentForm";
import Enrollments from "@/components/Enrollments";
import { useForm } from "@inertiajs/react";
import EditModule from "@/components/Forms/EditModule";

export default function ModuleMain({ module }) {
    // Saving the visibility of each floating window
    const [assignmentFormVisible, setAssignmentFormVisible] = useState(false);
    const [topicFormVisible, setTopicFormVisible] = useState(false);
    const [moduleEditFormVisible, setModuleEditFormVisible] = useState(false);
    const [enrollmentFormVisible, setEnrollFormVisible] = useState(false);

    // Setting whether a topic update is performed
    const topicId = useRef(null);
    const isTopicUpdate = useRef(false);

    console.log(module);

    // Form states

    // Topic Form
    const topicFormProps = useForm({
        topic_name: "",
        description: "",
        resources: [],
    });

    // Module Edit form
    const moduleEditFormProps = useForm({
        name: module.name,
        description: module.description,
        maximum_students: module.maximum_students,
        credit_value: module.credit_value,
        cover_image_url: null,
    });

    return (
        <GuestLayout>
            {topicFormVisible && (
                <FloatingWindowContainer
                    closeAction={() => {
                        setTopicFormVisible(false);

                        // Clear the topic update state
                        isTopicUpdate.current = false;

                        // Clear the previous values
                        topicId.current = null;

                        // Clearing form state such that new creation has no previous values
                        topicFormProps.reset();
                    }}
                >
                    <TopicForm
                        formProps={topicFormProps}
                        isUpdate={isTopicUpdate.current}
                        moduleId={module.id}
                        topicId={topicId.current}
                    />
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

            {enrollmentFormVisible && (
                <FloatingWindowContainer
                    closeAction={() => {
                        setEnrollFormVisible(false);
                    }}
                >
                    <Enrollments />
                </FloatingWindowContainer>
            )}

            {moduleEditFormVisible && (
                <FloatingWindowContainer
                    closeAction={() => {
                        setModuleEditFormVisible(false);
                    }}
                >
                    <EditModule
                        formProps={moduleEditFormProps}
                        moduleId={module.id}
                        defaultCoverImage={`/uploads/modules/${module.cover_image_url}`}
                    />
                </FloatingWindowContainer>
            )}

            <ModuleHeader
                moduleName={`${module.name}`}
                subTitle={module.description}
                coverImage={`/uploads/modules/${module.cover_image_url}`}
            />
            <div id="module-content" className={styles.moduleContent}>
                <ModuleToolbar
                    onTopicCreate={() => {
                        setTopicFormVisible(true);
                    }}
                    onAssignmentCreate={() => {
                        setAssignmentFormVisible(true);
                    }}
                    onEnrollments={() => {
                        setEnrollFormVisible(true);
                    }}
                    onModuleEdit={() => {
                        setModuleEditFormVisible(true);
                    }}
                />
                <h2>Module Content</h2>
                <article
                    id="topics-container"
                    className={styles.topicsContainer}
                >
                    <p>Pinned</p>
                    <section id="pinned"></section>
                    {module.topics.length > 0 ? (
                        module.topics.map((topic, index) => (
                            <Topic
                                key={topic.id}
                                resources={topic.resources}
                                topicName={topic.topic_name}
                                description={topic.description}
                                /* Toggling topic form with some initial values */
                                formToggle={() => {
                                    setTopicFormVisible(true);

                                    // Setting the initial values for the form
                                    topicFormProps.setData(
                                        "topic_name",
                                        topic.topic_name
                                    );
                                    topicFormProps.setData(
                                        "description",
                                        topic.description
                                    );

                                    topicFormProps.setData(
                                        "resources",
                                        topic.resources.map(resource => {
                                            return {
                                                id: resource.id,
                                                caption: resource.caption,
                                                is_deleted: resource.is_deleted,
                                                file: null,
                                            }
                                        })
                                    );

                                    // Since the topic form is an update
                                    isTopicUpdate.current = true;
                                    topicId.current = topic.id;
                                }}
                            />
                        ))
                    ) : (
                        <p>No topics available.</p>
                    )}
                </article>
            </div>
        </GuestLayout>
    );
}
