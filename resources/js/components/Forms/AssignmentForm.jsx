import React, { useState } from "react";
import styles from "./css/assignment-form.module.css";
import TextInput from "../Input/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faPlus, faUpload, faFile } from "@fortawesome/free-solid-svg-icons";
import Button from "../Input/Button";
import { useForm } from "@inertiajs/react";

export default function AssignmentForm({ assignment, isModuleStaff, moduleId }) {
    const { data, setData, post, processing, errors } = useForm({
        // Fields for creation (Staff)
        title: assignment?.title || "",
        description: assignment?.description || "",
        started: assignment?.started || "",
        deadline: assignment?.deadline || "",
        resource_caption: "",
        resource_file: null,
        // Fields for submission (Student)
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isModuleStaff) {
            if (assignment) {
                post(route('assignment.update', assignment.id));
            } else {
                post(route('assignment.create', moduleId));
            }
        } else {
            post(route('assignments.submit', assignment.id));
        }
    };

    if (!isModuleStaff && assignment) {
        return (
            <form className={styles.form} onSubmit={handleSubmit}>
                <header>
                    <h2><FontAwesomeIcon icon={faUpload} /> Submit Assignment</h2>
                    <p>Submitting for: <strong>{assignment.title}</strong></p>
                </header>

                <div className={styles.fieldGroup}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Upload File</label>
                        <input
                            type="file"
                            onChange={(e) => setData("resource_file", e.target.files[0])}
                            className={styles.fileInput}
                        />
                        {errors.resource_file && <span className={styles.error}>{errors.resource_file}</span>}
                    </div>

                    <TextInput
                        label="Submission Note (Optional)"
                        value={data.resource_caption}
                        onChange={(e) => setData("resource_caption", e.target.value)}
                        placeholder="e.g. Please find my individual work attached."
                    />
                </div>

                <Button type="submit" icon={faFile} disabled={processing}>
                    {processing ? "Submitting..." : "Submit Work"}
                </Button>
            </form>
        );
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <header>
                <h2><FontAwesomeIcon icon={faClock} /> {assignment ? "Edit" : "Create"} Assignment</h2>
                <p>Add the necessary details to manage the assignment.</p>
            </header>

            <TextInput
                label="Assignment Name"
                value={data.title}
                onChange={(e) => setData("title", e.target.value)}
                error={errors.title}
            />

            <div className={styles.grid}>
                <TextInput
                    label="Start Date"
                    type="datetime-local"
                    value={data.started}
                    onChange={(e) => setData("started", e.target.value)}
                    error={errors.started}
                />
                <TextInput
                    label="Deadline"
                    type="datetime-local"
                    value={data.deadline}
                    onChange={(e) => setData("deadline", e.target.value)}
                    error={errors.deadline}
                />
            </div>

            <TextInput
                label="Description"
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                error={errors.description}
            />

            {!assignment && (
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Topic Resource (File)</label>
                    <input
                        type="file"
                        onChange={(e) => setData("resource_file", e.target.files[0])}
                        className={styles.fileInput}
                    />
                </div>
            )}

            <Button type="submit" icon={faPlus} disabled={processing}>
                {processing ? "Saving..." : (assignment ? "Update Assignment" : "Create Assignment")}
            </Button>
        </form>
    );
}