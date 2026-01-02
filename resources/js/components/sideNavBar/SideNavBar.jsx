import { motion } from "framer-motion";
import SideNavBarHeader from "./SideNavBarHeader";
import SideNavBarContent from "./SideNavBarContent";
import SideNavBarFooter from "./SideNavBarFooter";
import style from "@/css/sideNavBar.module.css";

export default function SideNavBar({ isOpen, toggleSidebar }) {
  return (
    <motion.div
      className={`${style.sideNavBar} ${!isOpen ? style.minimized : ''}`}
      initial={{ width: isOpen ? 260 : 80 }}
      animate={{ width: isOpen ? 260 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <SideNavBarHeader isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <SideNavBarContent isOpen={isOpen} />
      <SideNavBarFooter isOpen={isOpen} />
    </motion.div>
  );
}
