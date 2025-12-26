import { useState } from "react";
import { useForm } from "@inertiajs/react";

export default function useFloatingForm(
    initialValues,
    initialMeta,
    visible,
    isUpdate = false
) {
    // Floading form visibility state
    const [formVisible, setFormVisible] = useState(visible);
    // Any additional data such as route parameters
    const [meta, setMeta] = useState(initialMeta || null);
    // Form state for the inertia form
    const formProps = useForm(initialValues);

    // Setting whether form is update or create can be done outside (true for update, false for create)
    const [updateMode, setUpdateMode] = useState(isUpdate);

    // Can provide initial values or meta optionally
    const openForm = (values = initialValues, meta = initialMeta, isUpdate) => {
        formProps.setData(values);
        setFormVisible(true);
        setMeta(meta || null);
        setUpdateMode(isUpdate);
    };

    const closeForm = () => {
        setFormVisible(false);
        setMeta(initialMeta || null);
        formProps.reset();
    };

    return {
        formProps,
        updateMode,
        formVisible,
        openForm,
        closeForm,
        meta,
    };
}
