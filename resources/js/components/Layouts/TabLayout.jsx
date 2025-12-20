import { useState } from "react";
import styles from "./css/tab-layout.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TabLayout({ tabs }) {
    // Default first tab is selected
    const [currentTab, setCurrentTab] = useState(tabs[0]);
    return (
        <div id="tab-layout" className={styles.container}>
            <header id="tabs" className={styles.tabs}>
                {tabs.map((tab, index) => {
                    return (
                        <button
                            style={
                                currentTab.name === tab.name
                                    ? { borderBottom: "3px solid black" }
                                    : {borderBottom: "3px solid transparent"}
                            }
                            className={styles.tabButton}
                            key={index}
                            onClick={() => setCurrentTab(tab)}
                        >
                            {tab.icon && <FontAwesomeIcon icon={tab.icon} />}{" "}
                            {tab.name}
                        </button>
                    );
                })}
            </header>
            <section id="tab-content">{currentTab.view}</section>
        </div>
    );
}
