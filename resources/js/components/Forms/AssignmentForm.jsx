import styles from "./css/topic-form.module.css";
import TextInput from "../Input/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../Input/Button";
import UploadBox from "../Input/UploadBox";

export default function AssignmentForm({
    formProps,
    isUpdate,
    moduleId,
    assignmentId,
}) {
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isUpdate) {
            formProps.post(
                route("assignment.update", {
                    assignmentId: assignmentId,
                }),
                {
                    preserveScroll: true,
                    forceFormData: true,
                    onSuccess: () => {
                        console.log("Assignment updated");
                    },
                },
            );
        } else {
            console.log("Data: ", formProps.data);
            formProps.post(route("assignment.create", { moduleId }), {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    console.log("Assignment created");
                },
            });
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <header>
                <h2>
                    <FontAwesomeIcon icon={faClock} />{" "}
                    {isUpdate ? "Update assignment" : "Create your assignment"}
                </h2>
                <p>
                    Add the necessary details of the topic to create the
                    assignment.
                </p>
            </header>
            <TextInput
                label="Assignment Name"
                value={formProps.data.title}
                name="title"
                max="50"
                onChange={(e) => {
                    formProps.setData("title", e.target.value);
                }}
                error={formProps.errors.title}
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
                error={formProps.errors.description}
            />
            <div style={{ display: "flex", gap: "1rem" }}>
                <TextInput
                    type="datetime-local"
                    value={formProps.data.started}
                    label="Start Date"
                    name="started"
                    onChange={(e) => {
                        formProps.setData("started", e.target.value);
                    }}
                    error={formProps.errors.started}
                />
                <TextInput
                    type="datetime-local"
                    value={formProps.data.deadline}
                    label="Due Date"
                    name="deadline"
                    onChange={(e) => {
                        formProps.setData("deadline", e.target.value);
                    }}
                    error={formProps.errors.deadline}
                />
            </div>

            <h3>Resource</h3>
            <TextInput
                label="Resource Caption"
                value={formProps.data.resource_caption}
                name="resource_caption"
                max="50"
                onChange={(e) => {
                    formProps.setData("resource_caption", e.target.value);
                }}
                error={formProps.errors.resource_caption}
            />
            <UploadBox
                caption="Upload your materials"
                name="resource_file"
                onUpload={(e) => {
                    formProps.setData("resource_file", e.target.files[0]);
                }}
                onReset={() => {
                    formProps.setData("resource_file", null);
                }}
                fileTypesCaption="Images, Pdfs, Word Documents"
                error={formProps.errors.resource_file}
            />

            <div className={styles.submitButtonContainer}>
                <Button type="submit" icon={isUpdate ? faEdit : faPlus}>
                    {isUpdate ? "Update" : "Create"} assignment
                </Button>
            </div>
        </form>
    );
}
