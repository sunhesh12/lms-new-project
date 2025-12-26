// src/components/sideNavBar/SideNavBarContent.jsx
import React from "react";
import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { Home, BookOpen, FileText, Users, MessageSquare, Calendar, ShieldCheck } from "lucide-react";
import style from "@/css/dashboard.module.css";

export default function SideNavBarContent({ isOpen }) {
  const { auth } = usePage().props;
  const isAdmin = auth.user?.role === 'admin';

  return (
    <nav className={style["sideNavBar-body"]}>
      <ul>
        {isAdmin && (
          <li>
            <Link
              href={route('admin.dashboard')}
              className={`${style.adminLink} ${usePage().component === 'Admin/Dashboard' ? style.active : ''}`}
            >
              <ShieldCheck size={20} />
              {!isOpen && <span>Admin Panel</span>}
            </Link>
          </li>
        )}
        <li>
          <Link href="/dashboard" className={usePage().component === 'Dashboard' ? style.active : ''}>
            <Home size={20} />
            {!isOpen && <span>Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link href="/modules" className={usePage().component.startsWith('Modules/') ? style.active : ''}>
            <BookOpen size={20} />
            {!isOpen && <span>Courses</span>}
          </Link>
        </li>
        <li>
          <Link href="/modules" className={style.subLink}>
            <FileText size={20} />
            {!isOpen && <span>Assignments</span>}
          </Link>
        </li>
        <li>
          <Link href={isAdmin ? route('admin.users.index') : "/modules"} className={style.subLink}>
            <Users size={20} />
            {!isOpen && <span>{isAdmin ? 'User Management' : 'Students'}</span>}
          </Link>
        </li>
        <li>
          <Link href="/chat" className={usePage().component === 'Chat' ? style.active : ''}>
            <MessageSquare size={20} />
            {!isOpen && <span>Message</span>}
          </Link>
        </li>
        <li>
          <Link href="/calendar" className={usePage().component === 'Calendar/Main' ? style.active : ''}>
            <Calendar size={20} />
            {!isOpen && <span>Calendar</span>}
          </Link>
        </li>
      </ul>
    </nav>
  );
}