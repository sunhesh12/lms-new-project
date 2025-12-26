import React from "react";
import styles from "@/css/layout.module.css";

export default function GuestLayout({children}) {
    return (
        <>
            <main className={styles.main}>
                {children}
            </main>
        </>
    );
}
