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
            <Link href={route('admin.dashboard')} className="text-blue-600 font-bold bg-blue-50/50">
              <ShieldCheck size={20} />
              {!isOpen && <span>Admin Panel</span>}
            </Link>
          </li>
        )}
        <li>
          <Link href="/dashboard">
            <Home size={20} />
            {!isOpen && <span>Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link href="/modules">
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
            <MessageSquare size={20} />
            {!isOpen && <span>Message</span>}
          </Link>
        </li>
        <li>
          <Link href="/calendar">
            <Calendar size={20} />
            {!isOpen && <span>Calendar</span>}
          </Link>
        </li>
      </ul>
    </nav>
  );
}