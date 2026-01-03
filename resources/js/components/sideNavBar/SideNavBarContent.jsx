// src/components/sideNavBar/SideNavBarContent.jsx
import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { Home, BookOpen, FileText, Users, MessageSquare, Calendar as CalendarIcon, ShieldCheck, LayoutDashboard, Search, GraduationCap, Sparkles, Activity } from "lucide-react";
import style from "@/css/sideNavBar.module.css";
import { motion } from "framer-motion";

export default function SideNavBarContent({ isOpen }) {
  const { auth } = usePage().props;
  const isAdmin = auth.user?.role === 'admin';
  const { component } = usePage();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: Home,
      active: component === 'Dashboard'
    },
    {
      label: "Campus Feed",
      href: "/feed",
      icon: Activity,
      active: component === 'Feed/Index'
    },
    {
      label: "Calendar",
      href: "/calendar",
      icon: CalendarIcon,
      active: component === 'Calendar/Main'
    },
    {
      label: "Courses",
      href: "/modules",
      icon: GraduationCap,
      active: component === 'Modules/Index' || component === 'Modules/Main'
    },
    {
      label: "Browse All",
      href: "/modules/browse",
      icon: Search,
      active: component === 'Modules/Browse'
    },
    {
      label: "Examinations",
      href: isAdmin ? route('admin.examinations') : "#",
      icon: FileText,
      active: component === 'Admin/Examinations',
      isAdminOnly: true
    },
    {
      label: "Messages",
      href: "/chat",
      icon: MessageSquare,
      active: component === 'Chat'
    },
    {
      label: "AI Assistant",
      href: route('ai.assistant'),
      icon: Sparkles,
      active: component === 'AIAssistant/Index'
    },
  ];

  if (isAdmin) {
    navItems.unshift({
      label: "Admin Panel",
      href: route('admin.dashboard'),
      icon: ShieldCheck,
      active: component === 'Admin/Dashboard',
      isAdmin: true
    });

    navItems.push({
      label: "Users",
      href: route('admin.users.index'),
      icon: Users,
      active: component === 'Admin/Users' || component === 'Admin/Users/Edit',
      isAdminOnly: true
    });
        navItems.push({
          label: "AI Providers",
          href: route('admin.ai-providers.index'),
          icon: Sparkles,
          active: component === 'Admin/AiProviders',
          isAdminOnly: true
        });
  }

  const filteredNavItems = navItems.filter(item => !item.isAdminOnly || isAdmin);

  return (
    <nav className={style["nav-section"]}>
      {isOpen && <div className={style["nav-label"]}>Navigation</div>}
      <ul className={style["nav-list"]}>
        {filteredNavItems.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              className={`${style["nav-item"]} ${item.active ? style.active : ''}`}
            >
              <div className={style["nav-icon-wrapper"]}>
                <item.icon size={20} strokeWidth={1.5} />
                {!isOpen && (
                  (item.label === "Dashboard" && auth.user?.unreadNotificationsCount > 0) ||
                  (item.label === "Messages" && auth.user?.unreadChatCount > 0)
                ) && (
                    <span className={style["nav-mini-badge"]}></span>
                  )}
              </div>
              {isOpen && (
                <motion.div
                  className={style["nav-label-container"]}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span>{item.label}</span>
                  {item.label === "Dashboard" && auth.user?.unreadNotificationsCount > 0 && (
                    <span className={style["nav-count-badge"]}>
                      {auth.user.unreadNotificationsCount > 9 ? '9+' : auth.user.unreadNotificationsCount}
                    </span>
                  )}
                  {item.label === "Messages" && auth.user?.unreadChatCount > 0 && (
                    <span className={style["nav-count-badge"]}>
                      {auth.user.unreadChatCount > 9 ? '9+' : auth.user.unreadChatCount}
                    </span>
                  )}
                </motion.div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}