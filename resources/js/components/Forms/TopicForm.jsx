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
    const handleSubmit = (e) => {
        e.preventDefault();

        formProps.transform((data) => {
            const formData = new FormData();

            formData.append("topic_name", data.topic_name);
            formData.append("description", data.description);

            data.resources.forEach((res, index) => {
                formData.append(`resources[${index}][id]`, res.id ?? "");
                formData.append(`resources[${index}][caption]`, res.caption ?? "");
                formData.append(`resources[${index}][file]`, res.file ?? "");
                formData.append(
                    `resources[${index}][is_deleted]`,
                    res.is_deleted ?? 0
                );
            });

            return formData;
        });

        if (isUpdate) {
            formProps.post(
                route("topic.update", {
                    moduleId: moduleId,
                    topicId: topicId,
                }),
                {
                    preserveScroll: true,
                    forceFormData: true,
                    onSuccess: () => {
                        console.log("Topic updated");
                    },
                }
            );
        } else {
            console.log("Data: ", formProps.data);
            formProps.post(route("topic.create", { moduleId }),{
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    console.log("Topic created");
                },
            });
        }
    };

    const AddResourceButton = () => {
        return (
            <Button
                icon={faPlus}
                size="small"
                onClick={() => {
                    formProps.setData("resources", [
                        ...formProps.data.resources,
                        {
                            id: crypto.randomUUID(),
                            is_deleted: 0,
                            file: null,
                            caption: "",
                        },
                    ]);
                }}
                noBackground={true}
            >
                Add resource
            </Button>
        );
    };

    const updateFile = (id, file) => {
        const updated = formProps.data.resources.map((resource) => {
            return resource.id === id
                ? {
                      ...resource,
                      file,
                      is_deleted: 0,
                  }
                : resource;
        });
        formProps.setData("resources", updated);
    };

    const resetFile = (id) => {
        const updated = formProps.data.resources.map((resource) => {
            return resource.id === id
                ? {
                      ...resource,
                      file: null,
                      is_deleted: 0,
                  }
                : resource;
        });
        formProps.setData("resources", updated);
    };

    const updateCaption = (id, caption) => {
        const updated = formProps.data.resources.map((resource) => {
            return resource.id === id
                ? {
                      ...resource,
                      caption,
                  }
                : resource;
        });
        formProps.setData("resources", updated);
    };

    const removeResource = (id) => {
        const updated = formProps.data.resources.map((resource) => {
            return resource.id === id
                ? {
                      ...resource,
                      is_deleted: 1,
                  }
                : resource;
        });
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
                render={({ id, caption }, index) => {
                    return (
                        <div key={index} className={styles.resourceInput}>
                            <TextInput
                                type="text"
                                name="caption"
                                label="Resource Caption"
                                value={
                                    formProps.data.resources.find(
                                        (resource) => id == resource.id
                                    ).caption
                                }
                                onChange={(e) => {
                                    updateCaption(id, e.target.value);
                                }}
                            />
                            <UploadBox
                                caption="Upload your materials"
                                name="file"
                                onUpload={(e) => {
                                    updateFile(id, e.target.files[0]);
                                }}
                                onReset={() => resetFile(id)}
                                fileTypesCaption="Images, Pdfs, Word Documents"
                            />
                            <Button
                                type="button"
                                icon={faTrash}
                                size="small"
                                onClick={() => removeResource(id)}
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
