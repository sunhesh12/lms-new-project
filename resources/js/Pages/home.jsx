import React from "react";
import Button from "@/components/Button";

// Styles
import styles from "@/css/home.module.css";
import GuestLayout from "@/Layouts/GuestLayout";

export default function Welcome() {
    return (
        <main>
            <GuestLayout>
                <div className={styles.heroContainer}>
                    <article className={styles.hero}>
                        <div>
                            <img
                                src="./images/welcome-image.png"
                                className={styles.heroArt}
                                alt="Welcome Image"
                            />
                        </div>
                        <div className={styles.right}>
                            <h1 className={styles.heroTitle}>
                                <span className={styles.blackText}>
                                    Organize.
                                </span>{" "}
                                <span className={styles.blueText}>Learn.</span>{" "}
                                <span className={styles.orangeText}>
                                    Create.
                                </span>
                            </h1>
                            <p className={styles.heroSubtitle}>
                                Welcome to the learning management System{" "}
                                <br></br>
                                of the <b>University of Sri Jayawardenepura.</b>
                            </p>
                            <div className={styles.buttonGroup}>
                                <a href={route("login")}>
                                    <button>Login</button>
                                </a>
                                <a href={route("register")}>
                                    <button href={route("register")}>
                                        Register
                                    </button>
                                </a>
                            </div>
                        </div>
                    </article>
                </div>
            </GuestLayout>
        </main>
    );
}
