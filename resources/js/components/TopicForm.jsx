import styles from "@/css/components/topic-form.module.css"
import TextInput from "./Input/TextInput"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBook, faPlus } from "@fortawesome/free-solid-svg-icons"
import Button from "./Button"

export default function TopicForm() {
    return (
        <form className={styles.form}>
            <header>
                <h2><FontAwesomeIcon icon={faBook} /> Create your topic</h2>
                <p>Add the necessary details of the topic to create the topic.</p>
            </header>
            <TextInput label="Topic Name" />
            <Button type="submit" icon={faPlus}>Create topic</Button>
        </form>
    )
}