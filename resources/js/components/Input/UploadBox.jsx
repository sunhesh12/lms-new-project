import style from "./css/upload-box.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function UploadBox({
    caption,
    fileTypesCaption,
    name,
    onUpload,
    defaultImage,
}) {
    const [uploadedImage, setUploadedImage] = useState(defaultImage);

    const computedBoxStyles = {
        backgroundColor: defaultImage ? "black" : "transparent",
    };

    const computedCaptionStyles = {
        color: defaultImage ? "white" : "var(--black)"
    }

    const computedIconStyles = {
        color: defaultImage ? "white" : "var(--black)"
    }

    return (
        <div
            id="upload-box"
            className={style.imageUploadBox}
            style={computedBoxStyles}
        >
            {defaultImage && (
                <img
                    id="uploaded-image"
                    className={style.uploadedImage}
                    src={uploadedImage}
                />
            )}
            <label htmlFor={name} className={style.topContent}>
                <FontAwesomeIcon
                    icon={faCloudArrowUp}
                    size="4x"
                    className={style.uploadIcon}
                    style={computedIconStyles}
                />
                <p className={style.caption} style={computedCaptionStyles}>{caption}</p>
                <p className={style.fileTypes} style={computedCaptionStyles}>{fileTypesCaption}</p>
                <input onChange={(e) => {
                    onUpload(e);
                    setUploadedImage(URL.createObjectURL(e.target.files[0]));
                }} type="file" name={name} id={name} />
            </label>
        </div>
    );
}
