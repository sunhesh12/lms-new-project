import React from "react";
import styles from "@/css/notification.module.css";

export default function Notification({ topic, message, type, Link }) {
    // Determine extra class based on the type
    const notificationClass = `${styles["dashboard-notification"]} ${
        type === "success"
            ? styles["dashboard-notification-success"]
            : type === "error"
            ? styles["dashboard-notification-fail"]
            : ""
    }`;

    return (
        <div className={notificationClass}>
            <div className={styles["notificationIconContent"]}>
                <div className={styles["notification-icon-container"]}>
                    <img
                        src="/icons/notification.ico"
                        alt="notification icon"
                        width={40}
                        height={40}
                        className={styles["notification-icon"]}
                    />
                </div>
                <div>
                    <h1>{topic} hello</h1>
                    <p>{message}</p>
                </div>
            </div>
            <div>
                {Link && (
                    <a href={Link} className={styles["notification-link"]}>
                        Click here
                    </a>
                )}
            </div>
        </div>
    );
}
