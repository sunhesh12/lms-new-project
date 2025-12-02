import styles from "@/css/components/topic-form.module.css";
import TextInput from "../Input/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../Input/Button";
import ItemList from "../Lists/ItemList";

export default function TopicForm({ formProps, moduleId, topicId, isUpdate }) {
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isUpdate) {
            formProps.post(
                route("topic.update", {
                    moduleId: moduleId,
                    topicId: topicId,
                }),
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        console.log("Topic updated");
                        formProps.reset();
                    },
                }
            );
        } else {
            formProps.post(route("topic.create", { moduleId }), {
                preserveScroll: true,
                onSuccess: () => {
                    console.log("Topic created");
                    formProps.reset();
                },
            });
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <header>
                <h2>
                    <FontAwesomeIcon icon={faBook} /> Create your topic
                </h2>
                <p>
                    Add the necessary details of the topic to create the topic.
                </p>
            </header>
            <TextInput
                label="Topic Name"
                value={formProps.data.topic_name}
                name="topic_name"
                max="50"
                onChange={(e) => {
                    formProps.setData("topic_name", e.target.value);
                }}
            />
            <TextInput
                type="textarea"
                value={formProps.data.description}
                label="Description"
                name="description"
                max="100"
                onChange={(e) => {
                    formProps.setData("description", e.target.value);
                }}
            />
            <ItemList items={[{itemName: "This is one"}]} render={({itemName}) => {
                return (
                    <TextInput type="text" label="" />
                )
            }}  />
            <Button type="submit" icon={isUpdate ? faEdit : faPlus}>
                {isUpdate ? "Update" : "Edit"} topic
            </Button>
        </form>
    );
}
