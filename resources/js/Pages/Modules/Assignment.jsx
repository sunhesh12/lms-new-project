import GuestLayout from "@/Layouts/GuestLayout";
import Button from "@/components/Input/Button";
import Card from "@/components/Card";
import UploadBox from "@/components/Input/UploadBox";
import styles from "@/css/assignment.module.css";
import { faArrowLeft, faCheck } from "@fortawesome/free-solid-svg-icons";

export default function Assignment({ moduleId, assignmentId }) {
    return (
        <GuestLayout>
            <h1>Assignment Title {assignmentId}</h1>
            <p>Module name</p>
            <Card>
                <div id="opening-date" className={styles.date}>
                    <span className="caption">Opens: </span>
                    <span className="value">
                        Wednesday, 20 November 2024, 12:00 AM
                    </span>
                </div>
                <div id="due-date" className={styles.date}>
                    <span className="caption">Due: </span>
                    <span className="value">
                        Friday, 29 November 2024, 1:00 PM
                    </span>
                </div>
                <div id="due-date" className={styles.date}>
                    <span className="caption">Remaining: </span>
                    <span className="value">
                        Friday, 29 November 2024, 1:00 PM
                    </span>
                </div>
            </Card>
            <h2>Add your submission</h2>
            <UploadBox />
            <div className={styles.buttons}>
                <Button icon={faCheck}>Complete Assignment</Button>
                <Button icon={faArrowLeft} noBackground={true} href={`/modules/${moduleId}`}>
                    Go Back to module
                </Button>
            </div>
        </GuestLayout>
    );
}
