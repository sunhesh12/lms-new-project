// src/components/sideNavBar/SideNavBarFooter.jsx
import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { Settings, User } from "lucide-react";
import style from "@/css/sideNavBar.module.css";

export default function SideNavBarFooter({ isOpen }) {
  const user = usePage().props.auth.user;

function formatName(name) {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0]; // Single name
  const lastName = parts[parts.length - 1];
  const initials = parts.slice(0, -1).map(n => n[0].toUpperCase() + ".").join(" ");
  return `${initials} ${lastName.toUpperCase()}`;
}
  return (
    <div className={style["sideNavBar-footer"]}>
      <Link href={route("logout")} method="post">
      <div className={style["sideNavBar-footer-settings"]}>
        <Settings size={20} />
        {!isOpen && <span>Settings</span>}
        </div>
      </Link>
      
      <Link href="/profile">
      <div className={style["sideNavBar-footer-logout"]}>
        <User size={20} />
        {!isOpen && <span>{formatName(user?.name)}</span>}
        </div>
      </Link>
    </div>
  );
}
