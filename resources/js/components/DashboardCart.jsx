import React from "react";
import {
  BookOpen,
  Plus,
  ClipboardList,
  CalendarDays,
  HelpCircle,
  Upload,
} from "lucide-react";
import styles from "@/css/dashboard.module.css";

const cards = [
  {
    icon: <BookOpen size={32} />,
    title: "Create courses",
    desc: "Create new courses to educate your students",
    link: "/dashboard/create-course",
  },
  {
    icon: <Plus size={32} />,
    title: "Create a lesson",
    desc: "Create more lessons with new knowledge to make a course productive",
    link: "/dashboard/create-lesson",
  },
  {
    icon: <ClipboardList size={32} />,
    title: "Create an assignment",
    desc: "Organize your semester by setting new tasks in the calendar",
    link: "/dashboard/create-assignment",
  },
  {
    icon: <CalendarDays size={32} />,
    title: "Set the semester plan",
    desc: "Organize your semester by setting new tasks and assignments in the calendar",
    link: "/dashboard/semester-plan",
  },
  {
    icon: <HelpCircle size={32} />,
    title: "Create a quiz",
    desc: "Organize your semester by setting new tasks in the calendar",
    link: "/dashboard/create-quiz",
  },
  {
    icon: <Upload size={32} />,
    title: "Upload examination results",
    desc: "Organize your semester by setting new tasks in the calendar",
    link: "/dashboard/upload-results",
  },
];

export default function DashboardJourney() {
  return (
    <div className={styles["dashboard-continue-journey-container"]}>
      <div className={styles["dashboard-grid-two-column"]}>
        {cards.map((card, index) => (
          <a
            key={index}
            href={card.link}
            className={styles["dashboard-card"]}
          >
            <div className={styles["dashboard-icon"]}>{card.icon}</div>
            <div className={styles["dashboard-text"]}>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
