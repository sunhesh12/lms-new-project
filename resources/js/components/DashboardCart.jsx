import React from "react";
import { usePage, Link } from "@inertiajs/react";
import {
  BookOpen,
  Plus,
  ClipboardList,
  CalendarDays,
  HelpCircle,
  Upload,
  Users,
  Activity,
  MessageSquare
} from "lucide-react";
import styles from "@/css/dashboard.module.css";

export default function DashboardJourney() {
  const { auth } = usePage().props;
  const role = auth.user?.role;

  const studentCards = [
    {
      icon: <BookOpen size={32} />,
      title: "Explore Courses",
      desc: "Browse and enroll in new modules and courses",
      link: "/modules",
    },
    {
      icon: <HelpCircle size={32} />,
      title: "Take a Quiz",
      desc: "Test your knowledge with active quizzes",
      link: "/modules/quiz",
    },
    {
      icon: <CalendarDays size={32} />,
      title: "My Calendar",
      desc: "Check your upcoming academic events and deadlines",
      link: "/calendar",
    },
    {
      icon: <MessageSquare size={32} />,
      title: "Messages",
      desc: "Connect with your lecturers and peers",
      link: "/chat",
    },
  ];

  const lecturerCards = [
    {
      icon: <BookOpen size={32} />,
      title: "My Modules",
      desc: "Manage the modules you are teaching",
      link: "/modules",
    },
    {
      icon: <Plus size={32} />,
      title: "Create Content",
      desc: "Add new topics or assignments to your modules",
      link: "/modules",
    },
    {
      icon: <HelpCircle size={32} />,
      title: "Manage Quizzes",
      desc: "Create and monitor student quizzes",
      link: "/modules",
    },
    {
      icon: <CalendarDays size={32} />,
      title: "Semester Plan",
      desc: "Organize your teaching schedule in the calendar",
      link: "/calendar",
    },
  ];

  const adminCards = [
    {
      icon: <Users size={32} />,
      title: "User Management",
      desc: "Manage system users, roles, and account status",
      link: route('admin.users.index'),
    },
    {
      icon: <Activity size={32} />,
      title: "System Health",
      desc: "Monitor core system services and performance",
      link: route('admin.health'),
    },
    {
      icon: <BookOpen size={32} />,
      title: "System Overview",
      desc: "Access the main administrator dashboards",
      link: route('admin.dashboard'),
    },
    {
      icon: <Upload size={32} />,
      title: "Content Moderation",
      desc: "Review and manage all educational content",
      link: "/modules",
    },
  ];

  const cards = role === 'admin' ? adminCards : (role === 'lecturer' ? lecturerCards : studentCards);

  return (
    <div className={styles["journey-container"]}>
      <div className={styles["journey-grid"]}>
        {cards.map((card, index) => (
          <Link
            key={index}
            href={card.link}
            className={styles["journey-card"]}
          >
            <div className={styles["journey-icon"]}>{card.icon}</div>
            <div className={styles["journey-content"]}>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
