// src/components/sideNavBar/SideNavBarContent.jsx
import React from "react";
import { Link } from "@inertiajs/react";
import { Home, BookOpen, FileText, Users } from "lucide-react";
import style from "@/css/dashboard.module.css";

export default function SideNavBarContent({ isOpen }) {
  return (
    <nav className={style["sideNavBar-body"]}>
      <ul>
        <li>
          <Link href="/dashboard">
            <Home size={20} />
            {!isOpen && <span>Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link href="/module">
            <BookOpen size={20} />
            {!isOpen && <span>Courses</span>}
          </Link>
        </li>
        <li>
          <Link href="/assignments">
            <FileText size={20} />
            {!isOpen && <span>Assignments</span>}
          </Link>
        </li>
        <li>
          <Link href="/students">
            <Users size={20} />
            {!isOpen && <span>Students</span>}
          </Link>
        </li>
        <li>
          <Link href="/chat">
            <Users size={20} />
            {!isOpen && <span>Message</span>}
          </Link>
        </li>
        <li>
          <Link href="/calendar">
            <Users size={20} />
            {!isOpen && <span>Calendar</span>}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
