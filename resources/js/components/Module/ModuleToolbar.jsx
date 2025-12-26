import { usePage } from "@inertiajs/react";
import styles from "./css/module-toolbar.module.css";
import Button from "@/components/Input/Button";
import {
    faBook,
    faClock,
    faCog,
    faEdit,
    faPlus,
    faQuestionCircle,
    faShield,
    faUser,
    faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

export default function ModuleToolbar({
    isModuleStaff,
    onTopicCreate,
    onAssignmentCreate,
    onQuizCreate,
    onEnrollments,
    onModuleEdit,
    onManageStaff,
}) {
    return (
        <div id="module-toolbar" className={styles.moduleToolbar}>
            {isModuleStaff && (
                <>
                    <Button icon={faBook} onClick={() => onTopicCreate()}>
                        Create Topic
                    </Button>
                    <Button icon={faClock} onClick={() => onAssignmentCreate()}>
                        Create Assignment
                    </Button>
                    <Button icon={faQuestionCircle} onClick={() => onQuizCreate()}>
                        Create Quiz
                    </Button>
                    <Button icon={faShield} onClick={() => onManageStaff()}>
                        Manage Staff
                    </Button>
                    <Button icon={faUserPlus} onClick={() => onEnrollments()}>
                        Enrollments
                    </Button>
                    <Button icon={faEdit} onClick={() => onModuleEdit()}>
                        Edit module
                    </Button>
                </>
            )}
        </div>
    );
}
