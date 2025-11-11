// src/components/sideNavBar/SideNavBar.jsx
import React from "react";
import SideNavBarHeader from "./SideNavBarHeader";
import SideNavBarContent from "./SideNavBarContent";
import SideNavBarFooter from "./SideNavBarFooter";
import style from "@/css/dashboard.module.css";

export default function SideNavBar({ isOpen, toggleSidebar }) {
  return (
    <div
      className={style["sideNavBar-container"]}
      style={{
        width: isOpen ? "80px" : "23%",
        transition: "width 0.5s ease",
      }}
    >
      <SideNavBarHeader isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <SideNavBarContent isOpen={isOpen} />
      <SideNavBarFooter isOpen={isOpen} />
    </div>
  );
}
