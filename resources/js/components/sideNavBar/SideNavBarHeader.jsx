// src/components/sideNavBar/SideNavBarHeader.jsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import style from "@/css/dashboard.module.css";
import style from "@/css/sideNavBar.module.css";

export default function SideNavBarHeader({ isOpen, toggleSidebar }) {
    return (
        <div className={style["sideNavBar-header"]}>
            <img
                src="/images/usjp-logo.png"
                alt="University Logo"
                className={style["sideNavBar-logo"]}
            />
            <div>
                {!isOpen && (
                    <p className={style["sideNavBar-header-title"]}>
                        University Of Sri Jayawardenepura
                    </p>
                )}
                {!isOpen && (
                    <p className={style["sideNavBar-header-sub-title"]}>
                        Faculty of Computing
                    </p>
                )}
            </div>
            <button
                className={style["sideNavBar-toggle"]}
                onClick={toggleSidebar}
            >
                {isOpen ? (
                    <ChevronRight size={25} />
                ) : (
                    <ChevronLeft size={25} />
                )}
            </button>
        </div>
    );
}
