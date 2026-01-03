import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/Input/Button";

// Styles
import styles from "@/css/home.module.css";
import GuestLayout from "@/Layouts/GuestLayout";

export default function Welcome() {
    return (
        <GuestLayout>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={styles.landingNavBar}
            >
                <div className={styles.navLinks}>
                    <div className={styles.navItem}>
                        <img
                            src="/icons/home.ico"
                            alt="Home"
                        />
                        <h1>Home</h1>
                    </div>
                    <div className={styles.navItem}>
                        <img
                            src="/icons/contact.ico"
                            alt="Contact"
                        />
                        <h1>Contact</h1>
                    </div>
                    <div className={styles.navItem}>
                        <img
                            src="/icons/help.ico"
                            alt="Help"
                        />
                        <h1>Need Help</h1>
                    </div>
                </div>
                
                <div className={styles.universityBranding}>
                    <img
                        src="/images/usjp-logo.png"
                        alt="USJP Logo"
                        className={styles.universityLogo}
                    />
                    <div className={styles.logoText}>
                        <h1>University of Sri Jayawardenepura</h1>
                        <p>Learning Management System</p>
                    </div>
                </div>
            </motion.nav>

            <div className={styles.heroContainer}>
                <article className={styles.hero}>
                    <motion.div
                        className={styles.heroImageContainer}
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <img
                            src="/images/welcome-image.png"
                            className={styles.heroArt}
                            alt="Welcome Image"
                        />
                    </motion.div>
                    
                    <motion.div
                        className={styles.right}
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h1 className={styles.heroTitle}>
                            <span className={styles.blackText}>Organize.</span>{" "}
                            <span className={styles.blueText}>Learn.</span>{" "}
                            <span className={styles.orangeText}>Create.</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Welcome to the learning management System <br />
                            of the <b>University of Sri Jayawardenepura.</b>
                        </p>
                        <div className={styles.buttonGroup}>
                            <Button href={route("login")}>Login</Button>
                            <Button href={route("register")}>Register</Button>
                        </div>
                    </motion.div>
                </article>
            </div>
        </GuestLayout>
    );
}
