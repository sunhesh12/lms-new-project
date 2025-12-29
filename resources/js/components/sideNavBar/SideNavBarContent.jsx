// src/components/sideNavBar/SideNavBarContent.jsx
import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { Home, BookOpen, FileText, Users, MessageSquare, Calendar, ShieldCheck, LayoutDashboard } from "lucide-react";
import style from "@/css/sideNavBar.module.css";
import { motion } from "framer-motion";

export default function SideNavBarContent({ isOpen }) {
  const { auth } = usePage().props;
  const isAdmin = auth.user?.role === 'admin';
  const { component } = usePage();

  const navItems = [
    { 
        label: "Calendar", 
        href: "/calendar", 
        icon: Home, // Using Home icon for Calendar as per image, or use Calendar icon? Image shows 'Home' icon for Calendar item? No, image has "Calendar" with Home icon likely, or just misplaced. Let's stick to semantic icons if possible, or match image strictly. Image: Home icon -> text "Calendar"? 
        // Image shows: Home icon -> Calendar label. Dashboard icon -> Dashboard label.
        // Let's use Home icon for first item as shown in image roughly
        icon: Home,
        active: component === 'Calendar/Main'
    },
    { 
        label: "Dashboard", 
        href: "/dashboard", 
        icon: LayoutDashboard,
        active: component === 'Dashboard'
    },
    { 
        label: "Courses", 
        href: "/modules", 
        icon: Users, // Image has a users-like icon for courses? Or stacked box. Let's use generic.
        active: component.startsWith('Modules/')
    },
    { 
        label: "Examinations", 
        href: "#", 
        icon: FileText,
        active: false 
    },
    { 
        label: "Messages", 
        href: "/chat", 
        icon: MessageSquare,
        active: component === 'Chat'
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
  }

  return (
    <nav className={style["nav-section"]}>
      {isOpen && <div className={style["nav-label"]}>Navigation</div>}
      <ul className={style["nav-list"]}>
        {navItems.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              className={`${style["nav-item"]} ${item.active ? style.active : ''}`}
            >
              <item.icon size={20} strokeWidth={1.5} />
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}