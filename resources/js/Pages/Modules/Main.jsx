import GuestLayout from "@/Layouts/GuestLayout";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import styles from "@/css/module.module.css";
import assignmentStyles from "@/css/components/assignments.module.css";
import Topic from "@/components/Accordion/Topic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModuleHeader from "@/components/Module/ModuleHeader";
import ModuleToolbar from "@/components/Module/ModuleToolbar";
import { useRef, useState } from "react";
import TopicForm from "@/components/Forms/TopicForm";
import FloatingWindowContainer from "@/Dialog/FloatingWindowContainer";
import AssignmentForm from "@/components/Forms/AssignmentForm";
import Enrollments from "@/components/Enrollments";
import ModuleStaff from "@/components/Module/ModuleStaff";
import { Link, useForm, usePage } from "@inertiajs/react";
import EditModule from "@/components/Forms/EditModule";
import TabLayout from "@/components/Layouts/TabLayout";
import QuizForm from "@/components/Forms/QuizForm";
import { router } from "@inertiajs/react";
import {
    faBook,
    faClock,
    faQuestionCircle,
    faEdit,
    faUpload,
    faClipboardList,
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
    const assignmentParentTopicId = useRef(null);
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
        maximum_students: module.maximum_students,
        credit_value: module.credit_value,
        cover_image_url: null,
        enrollment_key: module.enrollment_key || "",
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
                        assignments={topic.assignments}
                        topicName={topic.topic_name}
                        description={topic.description}
                        /* Toggling topic form with some initial values */
                        onAssignmentCreate={(tId) => {
                            assignmentParentTopicId.current = topic.id;
                            setAssignmentFormVisible(true);
                        }}
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
        <div className={assignmentStyles.container}>
            {module.assignments.length > 0 ? (
                module.assignments.map((assignment) => {
                    const now = new Date();
                    const startDate = new Date(assignment.started);
                    const deadline = new Date(assignment.deadline);
                    const isActive = now >= startDate && now <= deadline;

                    // Determine if student has a grade
                    // We need to pass submission info to student view. 
                    // The current module.assignments probably doesn't have student submission info deep nested unless I eager loaded it?
                    // I eager loaded 'resources' but not 'submissions'.
                    // For now, I will assume I might need to update the ModuleController to eager load submissions for the current student.
                    // But for the grading button, it's fine.

                    return (
                        <div key={assignment.id} className={assignmentStyles.card}>
                            <div className={assignmentStyles.content}>
                                <div className={assignmentStyles.iconWrapper}>
                                    <FontAwesomeIcon icon={faClock} size="lg" />
                                </div>
                                <div className={assignmentStyles.info}>
                                    <h3 className={assignmentStyles.title}>{assignment.title}</h3>
                                    <p className={assignmentStyles.description}>{assignment.description}</p>

                                    <div className={assignmentStyles.meta}>
                                        <div className={assignmentStyles.metaItem}>
                                            <span>Start: {startDate.toLocaleDateString()} {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className={assignmentStyles.metaItem}>
                                            <span>Due: {deadline.toLocaleDateString()} {deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className={assignmentStyles.metaItem}>
                                            {isActive ? (
                                                <span className={assignmentStyles.statusActive}>● Open</span>
                                            ) : (
                                                <span className={assignmentStyles.statusClosed}>● Closed</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Student Submission Status and Grade Display */}
                                    {!isModuleStaff && assignment.submissions && assignment.submissions.length > 0 && (
                                        <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Status:</span>
                                                <span style={{ fontSize: '0.9rem', color: '#16a34a', fontWeight: '600' }}>
                                                    ✓ Submitted {new Date(assignment.submissions[0].created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {assignment.submissions[0].grade !== null && (
                                                <>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: assignment.submissions[0].feedback ? '0.5rem' : '0', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
                                                        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Grade:</span>
                                                        <span style={{
                                                            fontWeight: '700',
                                                            color: assignment.submissions[0].grade >= 50 ? '#16a34a' : '#dc2626',
                                                            fontSize: '1.1rem'
                                                        }}>
                                                            {assignment.submissions[0].grade}/100
                                                        </span>
                                                    </div>
                                                    {assignment.submissions[0].feedback && (
                                                        <div style={{ fontSize: '0.9rem', color: '#475569', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                                                            <strong>Feedback:</strong> {assignment.submissions[0].feedback}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {isModuleStaff && (
                                    <Link
                                        href={route('assignment.grading', [module.id, assignment.id])}
                                        className={`${assignmentStyles.actionBtn} ${assignmentStyles.btnSecondary}`}
                                    >
                                        <FontAwesomeIcon icon={faClipboardList} /> Grade
                                    </Link>
                                )}

                                <button
                                    className={`${assignmentStyles.actionBtn} ${assignmentStyles.btnSecondary}`}
                                    onClick={isModuleStaff ? () => {
                                        setSelectedAssignment(assignment);
                                        setAssignmentFormVisible(true);
                                    } : () => {
                                        setSelectedAssignment(assignment);
                                        setAssignmentFormVisible(true);
                                    }}
                                >
                                    {isModuleStaff ? (
                                        <><FontAwesomeIcon icon={faEdit} /> Edit</>
                                    ) : (
                                        <><FontAwesomeIcon icon={faUpload} /> {assignment.submissions && assignment.submissions.length > 0 ? 'Resubmit' : 'Submit'}</>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className={assignmentStyles.emptyState}>
                    <p>No assignments available for this module yet.</p>
                </div>
            )}
        </div>
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
                        assignmentParentTopicId.current = null;
                    }}
                >
                    <AssignmentForm
                        assignment={selectedAssignment}
                        isModuleStaff={isModuleStaff}
                        moduleId={module.id}
                        topicId={assignmentParentTopicId.current}
                    />
                </FloatingWindowContainer>
            )}

            {enrollmentFormVisible && (
                <FloatingWindowContainer
                    closeAction={() => {
                        setEnrollFormVisible(false);
                    }}
                >
                    <Enrollments module={module} />
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
                        assignmentParentTopicId.current = null;
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
