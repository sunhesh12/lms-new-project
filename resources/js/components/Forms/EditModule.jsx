import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./css/module-edit.module.css";
import UploadBox from "../Input/UploadBox";
import TextInput from "../Input/TextInput";
import Button from "../Input/Button";

export default function EditModule({
    formProps,
    moduleId,
    defaultCoverImage
}) {
    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(formProps.data);
        console.log(moduleId);  

        formProps.post(route("module.update", {moduleId}), {
            preserveScroll: true,
            forceFormData: true,
            method: "__PATCH",
            onSuccess: () => {
                console.log("Module Updated");
            },
            onError: (e) => {
                console.log(e)
            }
        });
    }
    return (
        <form id="module-edit-form" onSubmit={handleSubmit} className={style.moduleEditForm}>
            <header>
                <h2>
                    <FontAwesomeIcon icon={faEdit} /> Edit Module
                </h2>
                <p>Change the details of the module</p>
            </header>
            <UploadBox
                caption="Change the module cover image"
                fileTypesCaption="JPEG, PNG file types upto 50MB"
                onUpload={(e) => {
                    formProps.setData("cover_image_url", e.target.files[0]);
                }}
                defaultImage={defaultCoverImage}
            />
            <TextInput type="text" label="Module Name" name="name" onChange={(e) => {
                formProps.setData("name", e.target.value);
            }} value={formProps.data.name} />
            <TextInput
                type="textarea"
                label="Module Description"
                name="description"
                onChange={(e) => {
                    formProps.setData("description", e.target.value);
                }}
                value={formProps.data.description}
            />
            <TextInput
                type="number"
                label="Credit Value"
                name="credit_value"
                onChange={(e) => {
                    formProps.setData("credit_value", parseInt(e.target.value));
                }}
                value={formProps.data.credit_value}
            />
            <TextInput
                type="number"
                label="Maximum Students"
                name="maximum_students"
                onChange={(e) => {
                    formProps.setData("maximum_students", parseInt(e.target.value));
                }}
                value={formProps.data.maximum_students}
            />
            <Button type="submit">Save</Button>
        </form>
    );
}
