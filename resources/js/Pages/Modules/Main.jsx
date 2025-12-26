import GuestLayout from "@/Layouts/GuestLayout";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import styles from "@/css/module.module.css";
import Topic from "@/components/Accordion/Topic";
import ModuleHeader from "@/components/Module/ModuleHeader";
import ModuleToolbar from "@/components/Module/ModuleToolbar";
import { useRef, useState } from "react";
import TopicForm from "@/components/Forms/TopicForm";
import FloatingWindowContainer from "@/Dialog/FloatingWindowContainer";
import AssignmentForm from "@/components/Forms/AssignmentForm";
import Enrollments from "@/components/Enrollments";
import ModuleStaff from "@/components/Module/ModuleStaff";
import { useForm, usePage } from "@inertiajs/react";
import EditModule from "@/components/Forms/EditModule";
import TabLayout from "@/components/Layouts/TabLayout";
import QuizForm from "@/components/Forms/QuizForm";
import { router } from "@inertiajs/react";
import {
    faBook,
    faClock,
    faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function ModuleMain({ module }) {
    const { auth } = usePage().props;
    const userRole = auth.user?.role;
    const userId = auth.user?.id;

    // Check if user is staff for this module (Admin or assigned Lecturer)
    const isModuleStaff = userRole === 'admin' || (userRole === 'lecturer' && module.lecturers.some(l => l.user_id === userId));

    // Saving the visibility of each floating window
    const [assignmentFormVisible, setAssignmentFormVisible] = useState(false);
    const [topicFormVisible, setTopicFormVisible] = useState(false);
    const [moduleEditFormVisible, setModuleEditFormVisible] = useState(false);
    const [enrollmentFormVisible, setEnrollFormVisible] = useState(false);
    const [staffFormVisible, setStaffFormVisible] = useState(false);
    const [quizFormVisible, setQuizFormVisible] = useState(false);

    // Selected items for forms
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    // Setting whether a topic update is performed
    const topicId = useRef(null);
    const isTopicUpdate = useRef(false);

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

    const TopicsView = () => (
        <article id="topics-container" className={styles.topicsContainer}>
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
                                topic.resources.map((resource) => {
                                    return {
                                        id: resource.id,
                                        caption: resource.caption,
                                        is_deleted: resource.is_deleted,
                                        file: null,
                                    };
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
    );

    const AssignmentsView = () => (
        <article className={styles.topicsContainer}>
            {module.assignments.length > 0 ? (
                module.assignments.map((assignment) => (
                    <Topic
                        key={assignment.id}
                        topicName={assignment.title}
                        description={assignment.description}
                        resources={assignment.resources || []}
                        formToggle={isModuleStaff ? () => {
                            // Staff logic for editing assignment
                            setSelectedAssignment(assignment);
                            setAssignmentFormVisible(true);
                        } : () => {
                            // Student logic for submitting
                            setSelectedAssignment(assignment);
                            setAssignmentFormVisible(true);
                        }}
                        isStudent={!isModuleStaff}
                        buttonText={isModuleStaff ? "Edit Assignment" : "Submit Assignment"}
                    />
                ))
            ) : (
                <p>No assignments available.</p>
            )}
        </article>
    );

    const QuizzesView = () => (
        <article className={styles.topicsContainer}>
            {module.quizzes.length > 0 ? (
                module.quizzes.map((quiz) => (
                    <Topic
                        key={quiz.id}
                        topicName={quiz.title}
                        description={quiz.description}
                        resources={[]} // Quizzes might not have direct resources here
                        formToggle={isModuleStaff ? () => {
                            // Staff logic for editing quiz
                            setSelectedQuiz(quiz);
                            setQuizFormVisible(true);
                        } : () => {
                            // Student logic for starting quiz
                            router.get(route('modules.quiz', { quiz_id: quiz.id }));
                        }}
                        isStudent={!isModuleStaff}
                        buttonText={isModuleStaff ? "Edit Quiz" : "Start Quiz"}
                    />
                ))
            ) : (
                <p>No quizzes available.</p>
            )}
        </article>
    );

    return (
        <AuthenticatedLayout>
            {/* <GuestLayout> */}
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
                        setSelectedAssignment(null);
                    }}
                >
                    <AssignmentForm
                        assignment={selectedAssignment}
                        isModuleStaff={isModuleStaff}
                        moduleId={module.id}
                    />
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
                        defaultCoverImage={`/storage/uploads/modules/${module.cover_image_url}`}
                    />
                </FloatingWindowContainer>
            )}

            {staffFormVisible && (
                <FloatingWindowContainer
                    closeAction={() => {
                        setStaffFormVisible(false);
                    }}
                >
                    <ModuleStaff module={module} />
                </FloatingWindowContainer>
            )}

            {quizFormVisible && (
                <FloatingWindowContainer
                    closeAction={() => {
                        setQuizFormVisible(false);
                        setSelectedQuiz(null);
                    }}
                >
                    <QuizForm
                        quiz={selectedQuiz}
                        moduleId={module.id}
                    />
                </FloatingWindowContainer>
            )}

            <ModuleHeader
                moduleName={`${module.name}`}
                subTitle={module.description}
                coverImage={`/storage/uploads/modules/${module.cover_image_url}`}
            />
            <div id="module-content" className={styles.moduleContent}>
                <ModuleToolbar
                    isModuleStaff={isModuleStaff}
                    onTopicCreate={() => {
                        setTopicFormVisible(true);
                    }}
                    onAssignmentCreate={() => {
                        setAssignmentFormVisible(true);
                    }}
                    onQuizCreate={() => {
                        setQuizFormVisible(true);
                    }}
                    onManageStaff={() => {
                        setStaffFormVisible(true);
                    }}
                    onEnrollments={() => {
                        setEnrollFormVisible(true);
                    }}
                    onModuleEdit={() => {
                        setModuleEditFormVisible(true);
                    }}
                />
                <h2>Module Content</h2>
            </div>
            <TabLayout
                tabs={[
                    { name: "Topics", icon: faBook, view: <TopicsView /> },
                    {
                        name: "Assignments",
                        icon: faClock,
                        view: <AssignmentsView />,
                    },
                    {
                        name: "Quizzes",
                        icon: faQuestionCircle,
                        view: <QuizzesView />,
                    },
                ]}
            />
            {/* </GuestLayout> */}
        </AuthenticatedLayout>
    );
}
