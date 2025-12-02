import styles from "@/css/components/topic-form.module.css"
import TextInput from "../Input/TextInput"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock, faPlus } from "@fortawesome/free-solid-svg-icons"
import Button from "../Input/Button"

export default function AssignmentForm() {
    return (
        <form className={styles.form}>
            <header>
                <h2><FontAwesomeIcon icon={faClock} /> Create your assignment</h2>
                <p>Add the necessary details of the topic to create the assignment.</p>
            </header>
            <TextInput label="Assignment Name" />
            <Button type="submit" icon={faPlus}>Create topic</Button>
        </form>
    )
}