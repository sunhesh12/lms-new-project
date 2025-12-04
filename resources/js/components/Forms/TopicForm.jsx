import styles from "./css/topic-form.module.css";
import TextInput from "../Input/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBook,
    faEdit,
    faPlus,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../Input/Button";
import ItemList from "../Lists/ItemList";
import InputLabel from "../Input/InputLabel";
import UploadBox from "../Input/UploadBox";

export default function TopicForm({ formProps, moduleId, topicId, isUpdate }) {
    console.log(formProps.errors);
    console.log(formProps.data);
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formProps.data);

        if (isUpdate) {
            formProps.post(
                route("topic.update", {
                    moduleId: moduleId,
                    topicId: topicId,
                }),
                {
                    ...formProps.data,
                    resources: formProps.data.resources.filter(
                        (resource) => resource.id != "-1"
                    ),
                },
                {
                    preserveScroll: true,
                    forceFormData: true,
                    onSuccess: () => {
                        console.log("Topic updated");
                        formProps.reset();
                    },
                }
            );
        } else {
            formProps.post(route("topic.create", { moduleId }), {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    console.log("Topic created");
                    formProps.reset();
                },
            });
        }
    };

    const AddResourceButton = (id) => {
        return (
            <Button
                icon={faPlus}
                size="small"
                onClick={() => {
                    formProps.setData("resources", [
                        ...formProps.data.resources,
                        {
                            id: id ?? "-1", // id -1 for newly added resources
                            caption: "",
                            is_deleted: 0,
                            file: null,
                        },
                    ]);
                }}
                noBackground={true}
            >
                Add resource
            </Button>
        );
    };

    const updateFile = (index, file) => {
        const updated = [...formProps.data.resources];
        updated[index].file = file;
        formProps.setData("resources", updated);
    };

    const resetFile = (index) => {
        const updated = [...formProps.data.resources];
        updated[index].file = null;
        formProps.setData("resources", updated);
    };

    const updateCaption = (index, caption) => {
        const updated = [...formProps.data.resources];
        updated[index].caption = caption;
        formProps.setData("resources", updated);
    };

    const removeResource = (index) => {
        const updated = [...formProps.data.resources];
        updated[index].is_deleted = 1;
        formProps.setData("resources", updated);
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
            <InputLabel label="Resources" />
            <ItemList
                items={formProps.data.resources.filter(
                    ({ is_deleted }) => !is_deleted
                )}
                fallback={() => (
                    <div className={styles.emptyResources}>
                        <InputLabel label="No resources have added. Include any resource to be available in the topic" />
                    </div>
                )}
                render={({ id }, index) => {
                    return (
                        <div key={index} className={styles.resourceInput}>
                            <input
                                type="hidden"
                                id="resource-id"
                                name="id"
                                value={id}
                            />
                            <TextInput
                                type="text"
                                name="caption"
                                label="Resource Caption"
                                value={formProps.data.resources[index].caption}
                                onChange={(e) => {
                                    console.log(
                                        index,
                                        formProps.data.resources
                                    );
                                    updateCaption(index, e.target.value);
                                }}
                            />
                            <UploadBox
                                caption="Upload your materials"
                                name="file"
                                onUpload={(e) => {
                                    updateFile(index, e.target.files[0]);
                                }}
                                onReset={() => resetFile(index)}
                                fileTypesCaption="Images, Pdfs, Word Documents"
                            />
                            <Button
                                type="button"
                                icon={faTrash}
                                size="small"
                                onClick={() => removeResource(index)}
                                noBackground={true}
                                backgroundColor="delete"
                            >
                                Remove
                            </Button>
                        </div>
                    );
                }}
            />
            <AddResourceButton />
            <div className={styles.submitButtonContainer}>
                <Button type="submit" icon={isUpdate ? faEdit : faPlus}>
                    {isUpdate ? "Update" : "Create"} topic
                </Button>
            </div>
        </form>
    );
}
