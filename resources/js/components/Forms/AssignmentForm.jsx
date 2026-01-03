import React, { useState, useEffect } from "react";
import styles from "./css/assignment-form.module.css";
import TextInput from "../Input/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faPlus, faUpload, faFile } from "@fortawesome/free-solid-svg-icons";
import Button from "../Input/Button";
import { useForm } from "@inertiajs/react";

export default function AssignmentForm({ assignment, isModuleStaff, moduleId, topicId }) {
    const [fileError, setFileError] = useState(null);
    
    // Convert backend date format (Y-m-d H:i:s) to datetime-local format (YYYY-MM-DDTHH:mm)
    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        // If already in datetime-local format, return as is
        if (dateString.includes("T")) {
            // Ensure it's in the correct format (YYYY-MM-DDTHH:mm)
            const datePart = dateString.split("T")[0];
            const timePart = dateString.split("T")[1] || "00:00";
            return `${datePart}T${timePart.substring(0, 5)}`;
        }
        // Convert from "Y-m-d H:i:s" or "Y-m-d H:i" to "YYYY-MM-DDTHH:mm"
        if (dateString.includes(" ")) {
            const [datePart, timePart] = dateString.split(" ");
            if (datePart && timePart) {
                const time = timePart.substring(0, 5); // Get HH:mm
                return `${datePart}T${time}`;
            }
        }
        // If just date, add default time
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return `${dateString}T00:00`;
        }
        return dateString;
    };

    const { data, setData, post, processing, errors, transform } = useForm({
        // Fields for creation (Staff)
        title: assignment?.title || "",
        description: assignment?.description || "",
        started: formatDateForInput(assignment?.started || ""),
        deadline: formatDateForInput(assignment?.deadline || ""),
        resource_caption: "",
        resource_file: null,
        // Fields for submission (Student) - resource_file is shared
        topic_id: assignment?.topic_id || topicId || "",
    });

    // Update dates when assignment prop changes (for Firefox compatibility)
    useEffect(() => {
        if (assignment) {
            const formattedStarted = formatDateForInput(assignment.started || "");
            const formattedDeadline = formatDateForInput(assignment.deadline || "");
            // Only update if the formatted value is different and not empty
            if (formattedStarted && formattedStarted !== data.started) {
                setData("started", formattedStarted);
            }
            if (formattedDeadline && formattedDeadline !== data.deadline) {
                setData("deadline", formattedDeadline);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assignment?.id]); // Only re-run when assignment ID changes

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (10MB = 10 * 1024 * 1024 bytes)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                setFileError('File size must be less than 10MB');
                setData("resource_file", null);
                e.target.value = ''; // Clear the input
                return;
            }
            setFileError(null);
            setData("resource_file", file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Format dates for backend before submission
        const formatForBackend = (dateValue) => {
            if (!dateValue) return "";
            // If already in backend format (contains space and seconds), return as is
            if (dateValue.includes(" ") && dateValue.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)) {
                return dateValue;
            }
            // Convert from datetime-local format (YYYY-MM-DDTHH:mm) to backend format (Y-m-d H:i:s)
            if (dateValue.includes("T")) {
                return dateValue.replace("T", " ") + ":00";
            }
            // If just date, add default time
            if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
                return dateValue + " 00:00:00";
            }
            return dateValue;
        };

        // Update form data with properly formatted dates
        setData({
            ...data,
            started: formatForBackend(data.started),
            deadline: formatForBackend(data.deadline),
        });

        // Use transform to ensure dates are formatted correctly when submitting
        transform((data) => ({
            ...data,
            started: formatForBackend(data.started),
            deadline: formatForBackend(data.deadline),
        }));

        if (isModuleStaff) {
            if (assignment) {
                post(route('assignment.update', assignment.id), {
                    forceFormData: true,
                    onError: (errors) => {
                        console.error('Assignment update errors:', errors);
                    },
                    onSuccess: () => {
                        console.log('Assignment updated successfully');
                    }
                });
            } else {
                post(route('assignment.create', moduleId), {
                    forceFormData: true,
                    onError: (errors) => {
                        console.error('Assignment creation errors:', errors);
                        console.error('Form data:', data);
                    },
                    onSuccess: () => {
                        console.log('Assignment created successfully');
                    }
                });
            }
        } else {
            post(route('assignments.submit', assignment.id), {
                forceFormData: true
            });
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
                            onChange={handleFileChange}
                            className={styles.fileInput}
                            accept=".pdf,.doc,.docx,.txt,.zip,.rar,.ppt,.pptx,.xls,.xlsx"
                        />
                        {fileError && <span className={styles.error}>{fileError}</span>}
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
                    step="60"
                />
                <TextInput
                    label="Deadline"
                    type="datetime-local"
                    value={data.deadline}
                    onChange={(e) => setData("deadline", e.target.value)}
                    error={errors.deadline}
                    step="60"
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
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Assignment Resource (File)</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className={styles.fileInput}
                        />
                        {fileError && <span className={styles.error}>{fileError}</span>}
                        {errors.resource_file && <span className={styles.error}>{errors.resource_file}</span>}
                    </div>

                    <TextInput
                        label="Resource Caption"
                        value={data.resource_caption}
                        onChange={(e) => setData("resource_caption", e.target.value)}
                        placeholder="e.g. Assignment Instructions PDF"
                        error={errors.resource_caption}
                    />
                </div>
            )}

            <Button type="submit" icon={faPlus} disabled={processing}>
                {processing ? "Saving..." : (assignment ? "Update Assignment" : "Create Assignment")}
            </Button>
        </form>
    );
}