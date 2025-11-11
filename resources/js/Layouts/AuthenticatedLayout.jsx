import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import style from "@/css/dashboard.module.css";
import SideNavBar from "@/components/sideNavBar/SideNavBar";

export default function AuthenticatedLayout({ header, children }) {
  const user = usePage().props.auth  .user;
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  return (
    <div className={style["dashboard-container1"]}>
      <SideNavBar
        isOpen={isSideBarOpen}
        toggleSidebar={() => setIsSideBarOpen(!isSideBarOpen)}
      />

      <div>
        <main>{children}</main>
      </div>
    </div>
  );
}
