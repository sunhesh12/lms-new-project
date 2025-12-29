import style from "./css/upload-box.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCloudArrowUp,
    faFile,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Button from "./Button";

export default function UploadBox({
    caption,
    fileTypesCaption,
    name,
    onUpload,
    onReset,
    imagePreview,
    error,
}) {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(imagePreview);

    const computedBoxStyles = {
        backgroundColor: imagePreview ? "black" : "transparent",
    };

    const computedCaptionStyles = {
        color: imagePreview ? "white" : "var(--black)",
    };

    const computedIconStyles = {
        color: imagePreview ? "white" : "var(--black)",
    };

    const computedButtonStyles = {
        backgroundColor: imagePreview ? "white" : "delete",
    };

    const updatePreview = (file) => {
        setPreviewURL(URL.createObjectURL(file));
        setUploadedFile(file);
    };

    const resetPreview = () => {
        setUploadedFile(null);
        setPreviewURL(imagePreview || null);
        onReset();
    };

    return (
        <div
            id="upload-box"
            className={style.imageUploadBox}
            style={computedBoxStyles}
        >
            {imagePreview && (
                <img
                    id="uploaded-image"
                    className={style.uploadedImage}
                    src={previewURL}
                />
            )}
            {uploadedFile && (
                <div className={style.uploadedFile} id="uploaded-files">
                    <p className={style.caption} style={computedCaptionStyles}>
                        <FontAwesomeIcon icon={faFile} /> {uploadedFile.name}
                    </p>
                    <Button
                        noBackground={true}
                        onClick={() => resetPreview()}
                        backgroundColor={computedButtonStyles.backgroundColor}
                    >
                        <FontAwesomeIcon icon={faTrash} /> Remove file
                    </Button>
                </div>
            )}
            {!uploadedFile && (
                <label htmlFor={name} className={style.topContent}>
                    <FontAwesomeIcon
                        icon={faCloudArrowUp}
                        size="4x"
                        className={style.uploadIcon}
                        style={computedIconStyles}
                    />
                    <p className={style.caption} style={computedCaptionStyles}>
                        {caption}
                    </p>
                    <p
                        className={style.fileTypes}
                        style={computedCaptionStyles}
                    >
                        {fileTypesCaption}
                    </p>
                    <input
                        onChange={(e) => {
                            onUpload(e);
                            updatePreview(e.target.files[0]);
                        }}
                        type="file"
                        name={name}
                        id={name}
                    />
                    {error && <span className={style.errorText}>{error}</span>}
                </label>
            )}
        </div>
    );
}
