import styles from "@/css/components/module-toolbar.module.css";
import Button from "@/components/Button";
import { faBook, faClock, faCog, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";

export default function ModuleToolbar({ onTopicCreate, onAssignmentCreate }) {
    return (
        <div id="module-toolbar" className={styles.moduleToolbar}>
            <Button icon={faBook} onClick={() => onTopicCreate()}>
                Create Topic
            </Button>
            <Button icon={faClock} onClick={() => onAssignmentCreate()}>
                Create Assignment
            </Button>
            <Button icon={faUser}>
                Enrollments
            </Button>
            <Button icon={faCog}>
                Settings
            </Button>
            <Button icon={faPlus}>Create Topic</Button>
            <Button icon={faPlus} noBackground={true}>
                Create Topic
            </Button>
        </div>
    );
}
