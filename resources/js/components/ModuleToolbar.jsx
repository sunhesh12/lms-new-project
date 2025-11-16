import styles from "@/css/components/module-toolbar.module.css";
import Button from "@/components/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function ModuleToolbar() {
    return (
        <div id="module-toolbar" className={styles.moduleToolbar}>
            <Button icon={faPlus}>Create Topic</Button>
            <Button icon={faPlus}>Create Topic</Button>
            <Button icon={faPlus}>Create Topic</Button>
            <Button icon={faPlus} noBackground={true}>Create Topic</Button>
        </div>
    );
}
