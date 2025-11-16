import GuestLayout from "@/Layouts/GuestLayout";
import Card from "@/components/Card";
import styles from "@/css/assignment.module.css";

export default function Assignment({ assignmentId }) {
    return (
        <GuestLayout>
            <h1>Assignment Title {assignmentId}</h1>
            <p>Module name</p>
            <Card>
                <div id="opening-date" className={styles.date}>
                    <span className="caption">Opens: </span>
                    <span className="value">Wednesday, 20 November 2024, 12:00 AM</span>
                </div>
                <div id="due-date" className={styles.date}>
                    <span className="caption">Due: </span>
                    <span className="value">Friday, 29 November 2024, 1:00 PM</span>
                </div>
                <div id="due-date" className={styles.date}>
                    <span className="caption">Remaining: </span>
                    <span className="value">Friday, 29 November 2024, 1:00 PM</span>
                </div>
            </Card>
            <h1>Add your submission</h1>
            
        </GuestLayout>
    );
}
