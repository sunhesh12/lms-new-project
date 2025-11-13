import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import Button from "@/components/Button";
// import '@/../css/app.css';

// Styles
import styles from "@/css/home.module.css";
import GuestLayout from "@/Layouts/GuestLayout";

export default function Welcome() {
    return (
        <main>
            <GuestLayout>
                <div className={styles["landing-NavBar"]}>
                    <div className={styles["landing-NavBar-first-Container"]}>
                        <div className={styles["landing-NavBar-Elements"]}>
                            <img
                                src="@/../icons/home.ico"
                                alt="LMS Logo"
                                height="50px"
                            />
                            <h1>Home</h1>
                        </div>
                        <div className={styles["landing-NavBar-Elements"]}>
                            <img
                                src="@/../icons/contact.ico"
                                alt="LMS Logo"
                                height="50px"
                            />
                            <h1>Contact</h1>
                        </div>

                        <div className={styles["landing-NavBar-Elements"]}>
                            <img
                                src="@/../icons/help.ico"
                                alt="LMS Logo"
                                height="50px"
                            />
                            <h1>Need Help</h1>
                        </div>
                    </div>
                    <div className={styles["landing-NavBar-Second-Container"]}>
                        <div className={styles["Landing-NavBar-logo"]}>
                            <div>
                                <img
                                    src="@/../images/usjp-logo.png"
                                    alt="LMS Logo"
                                    height="70px"
                                />
                            </div>
                            <div className={styles["Landing-NavBar-logo-Text"]}>
                                <h1>University of Sri Jayawardenepura</h1>
                                <p>Learning Management System</p>
                            </div>
                        </div>

                    </div>
                </div>
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
                                <Button href={route("login")}>Login</Button>
                                <Button href={route("register")}>
                                    Register
                                </Button>
                            </div>
                        </div>
                    </article>
                </div>
            </GuestLayout>
        </main>
    );
}
