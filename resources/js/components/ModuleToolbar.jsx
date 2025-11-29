import styles from "@/css/components/module-toolbar.module.css";
import Button from "@/components/Button";
import {
    faBook,
    faClock,
    faCog,
    faEdit,
    faPlus,
    faUser,
} from "@fortawesome/free-solid-svg-icons";

export default function ModuleToolbar({
    onTopicCreate,
    onAssignmentCreate,
    onEnrollments,
    onModuleEdit,
}) {
    return (
        <div id="module-toolbar" className={styles.moduleToolbar}>
            <Button icon={faBook} onClick={() => onTopicCreate()}>
                Create Topic
            </Button>
            <Button icon={faClock} onClick={() => onAssignmentCreate()}>
                Create Assignment
            </Button>
            <Button icon={faUser} onClick={() => onEnrollments()}>
                Enrollments
            </Button>
            <Button icon={faEdit} onClick={() => onModuleEdit()}>Edit module</Button>
        </div>
    );
}
