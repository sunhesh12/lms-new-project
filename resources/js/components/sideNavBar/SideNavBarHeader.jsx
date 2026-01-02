// src/components/sideNavBar/SideNavBarHeader.jsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import style from "@/css/dashboard.module.css";
import style from "@/css/sideNavBar.module.css";
import { motion } from "framer-motion";
import NotificationBell from "../NotificationBell";

export default function SideNavBarHeader({ isOpen, toggleSidebar }) {
    return (
        <div className={`${style["sideNavBar-header-container"]} ${!isOpen ? style.minimized : ''}`}>
            <div className={style["sideNavBar-header"]}>
                <img
                    src="/images/usjp-logo.png"
                    alt="University Logo"
                    className={style["sideNavBar-logo"]}
                />

                {isOpen && (
                    <motion.div
                        className={style["header-text-container"]}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <p className={style["sideNavBar-header-title"]}>
                            Learning management System
                        </p>
                        <p className={style["sideNavBar-header-sub-title"]}>
                            Faculty of computing
                        </p>
                    </motion.div>
                )}

                <div className={style["header-actions"]}>
                    {/* <NotificationBell /> */}
                    <button
                        className={style["sideNavBar-toggle"]}
                        onClick={toggleSidebar}
                    >
                        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>
            </div>
            {/* Search bar removed as per request */}
        </div>
    );
}
