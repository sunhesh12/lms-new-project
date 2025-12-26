import React, { useState, useEffect } from "react";
import styles from "./css/quiz-form.module.css";
import TextInput from "../Input/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faPlus, faTrash, faImage, faSave, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import Button from "../Input/Button";
import { useForm, router } from "@inertiajs/react";

export default function QuizForm({ quiz, moduleId }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: quiz?.title || "",
        description: quiz?.description || "",
        duration: quiz?.duration || 1800,
        passing_score: quiz?.passing_score || 60,
        module_id: moduleId,
        allow_multiple_attempts: quiz?.allow_multiple_attempts ?? true,
        max_attempts: quiz?.max_attempts || 0,
        questions: quiz?.questions || []
    });

    const [editingQuestions, setEditingQuestions] = useState(data.questions.length > 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (quiz) {
            post(route('quizzes.update', quiz.id));
        } else {
            post(route('quizzes.store'), {
                onSuccess: () => reset()
            });
        }
    };

    const addQuestion = () => {
        const newQuestion = {
            id: null,
            question: "",
            options: ["", ""],
            correct_answer: 0,
            points: 1,
            image: null
        };
        setData("questions", [...data.questions, newQuestion]);
        setEditingQuestions(true);
    };

    const removeQuestion = (index) => {
        const newQuestions = [...data.questions];
        newQuestions.splice(index, 1);
        setData("questions", newQuestions);
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...data.questions];
        newQuestions[index][field] = value;
        setData("questions", newQuestions);
    };

    const addOption = (qIndex) => {
        const newQuestions = [...data.questions];
        newQuestions[qIndex].options.push("");
        setData("questions", newQuestions);
    };

    const removeOption = (qIndex, oIndex) => {
        const newQuestions = [...data.questions];
        newQuestions[qIndex].options.splice(oIndex, 1);
        setData("questions", newQuestions);
    };

    const updateOption = (qIndex, oIndex, value) => {
        const newQuestions = [...data.questions];
        newQuestions[qIndex].options[oIndex] = value;
        setData("questions", newQuestions);
    };

    const handleSyncQuestions = () => {
        post(route('quizzes.questions.sync', quiz.id), {
            forceFormData: true
        });
    };

    return (
        <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <header>
                    <h2><FontAwesomeIcon icon={faClock} /> {quiz ? "Edit" : "Create"} Quiz</h2>
                    <p>Set up the basic details of the quiz first.</p>
                </header>

                <TextInput
                    label="Quiz Title"
                    value={data.title}
                    onChange={(e) => setData("title", e.target.value)}
                    error={errors.title}
                />

                <TextInput
                    label="Description"
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    error={errors.description}
                />

                <div className={styles.row}>
                    <TextInput
                        label="Duration (seconds)"
                        type="number"
                        value={data.duration}
                        onChange={(e) => setData("duration", e.target.value)}
                        error={errors.duration}
                    />
                    <TextInput
                        label="Passing Score (%)"
                        type="number"
                        value={data.passing_score}
                        onChange={(e) => setData("passing_score", e.target.value)}
                        error={errors.passing_score}
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.checkboxGroup}>
                        <label>
                            <input
                                type="checkbox"
                                checked={data.allow_multiple_attempts}
                                onChange={(e) => setData("allow_multiple_attempts", e.target.checked)}
                            />
                            Allow Multiple Attempts
                        </label>
                    </div>
                    {data.allow_multiple_attempts && (
                        <TextInput
                            label="Max Attempts (0 for unlimited)"
                            type="number"
                            value={data.max_attempts}
                            onChange={(e) => setData("max_attempts", e.target.value)}
                            error={errors.max_attempts}
                        />
                    )}
                </div>

                <div className={styles.buttonGroup}>
                    <Button type="submit" icon={faSave} disabled={processing}>
                        {processing ? "Saving..." : (quiz ? "Update Quiz Info" : "Create Quiz")}
                    </Button>
                </div>
            </form>

            {quiz && (
                <div className={styles.questionsSection}>
                    <header className={styles.questionsHeader}>
                        <div>
                            <h3>
                                <FontAwesomeIcon icon={faQuestionCircle} /> Questions
                            </h3>
                            <p>Manage questions and answers for this quiz.</p>
                        </div>
                        <Button type="button" onClick={addQuestion} icon={faPlus} backgroundColor="create">
                            Add Question
                        </Button>
                    </header>

                    {data.questions.map((q, qIndex) => (
                        <div key={qIndex} className={styles.questionCard}>
                            <button
                                type="button"
                                onClick={() => removeQuestion(qIndex)}
                                className={styles.removeButton}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>

                            <TextInput
                                label={`Question ${qIndex + 1}`}
                                value={q.question}
                                onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                            />

                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>
                                    <FontAwesomeIcon icon={faImage} /> Question Image (Optional)
                                </label>
                                <input
                                    type="file"
                                    className={styles.fileInput}
                                    onChange={(e) => updateQuestion(qIndex, "image", e.target.files[0])}
                                />
                                {q.image_url && <p className={styles.infoText}>Current image exists</p>}
                            </div>

                            <div className={styles.optionsGroup}>
                                <label className={styles.label}>Options</label>
                                {q.options.map((option, oIndex) => (
                                    <div key={oIndex} className={styles.optionRow}>
                                        <input
                                            type="radio"
                                            name={`correct_${qIndex}`}
                                            checked={q.correct_answer === oIndex}
                                            onChange={() => updateQuestion(qIndex, "correct_answer", oIndex)}
                                        />
                                        <input
                                            type="text"
                                            className={styles.optionInput}
                                            value={option}
                                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                            placeholder={`Option ${oIndex + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeOption(qIndex, oIndex)}
                                            className={styles.removeOption}
                                        >
                                            <FontAwesomeIcon icon={faTrash} size="sm" />
                                        </button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    onClick={() => addOption(qIndex)}
                                    className={styles.addOptionButton}
                                >
                                    + Add Option
                                </Button>
                            </div>

                            <div className={styles.fieldGroup}>
                                <TextInput
                                    label="Points"
                                    type="number"
                                    value={q.points}
                                    onChange={(e) => updateQuestion(qIndex, "points", e.target.value)}
                                />
                            </div>
                        </div>
                    ))}

                    {data.questions.length > 0 && (
                        <div className={styles.syncContainer}>
                            <Button type="button" onClick={handleSyncQuestions} icon={faSave} backgroundColor="create" disabled={processing}>
                                {processing ? "Syncing..." : "Sync All Questions"}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
