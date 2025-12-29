// src/components/sideNavBar/SideNavBarFooter.jsx
import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { Settings, User, LogOut, Bell, Lock, HelpCircle, X } from "lucide-react";
import style from "@/css/sideNavBar.module.css";
import modalStyle from "@/css/settingsModal.module.css";

export default function SideNavBarFooter({ isOpen }) {
  const user = usePage().props.auth.user;
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  function formatName(name) {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0]; // Single name
    const lastName = parts[parts.length - 1];
    const initials = parts.slice(0, -1).map(n => n[0].toUpperCase() + ".").join(" ");
    return `${initials} ${lastName.toUpperCase()}`;
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      router.post(route("logout"));
    }
  };

  return (
    <>
      <div className={style["sideNavBar-footer"]}>
        <div 
          className={style["settings-link"]}
          onClick={() => setShowSettingsModal(true)}
        >
          <Settings size={20} />
          {isOpen && <span>Settings</span>}
        </div>
        
        <Link href="/profile" className={style["user-profile-card"]}>
          <img 
            src={user?.avatar_url || "/images/default-avatar.png"} // Fallback or user avatar
            alt="Profile" 
            className={style.avatar}
            onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + (user?.name || "User") + "&background=random"; }}
          />
          {isOpen && (
            <div className={style["user-info"]}>
              <span className={style["user-name"]}>{user?.name}</span>
              <span className={style["user-email"]}>{user?.email}</span>
            </div>
          )}
        </Link>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div 
          className={modalStyle.settingsModalOverlay} 
          onClick={() => setShowSettingsModal(false)}
        >
          <div 
            className={modalStyle.settingsModal} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className={modalStyle.settingsModalHeader}>
              <h2>Settings</h2>
              <button 
                className={modalStyle.closeBtn}
                onClick={() => setShowSettingsModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className={modalStyle.settingsModalBody}>
              <Link href="/profile" className={modalStyle.settingsItem}>
                <User size={18} />
                <span>Profile Settings</span>
              </Link>

              <Link href="#" className={modalStyle.settingsItem}>
                <Bell size={18} />
                <span>Notifications</span>
              </Link>

              <Link href="#" className={modalStyle.settingsItem}>
                <Lock size={18} />
                <span>Privacy & Security</span>
              </Link>

              <Link href="#" className={modalStyle.settingsItem}>
                <HelpCircle size={18} />
                <span>Help & Support</span>
              </Link>

              <div className={modalStyle.settingsDivider}></div>

              <button 
                className={`${modalStyle.settingsItem} ${modalStyle.logoutItem}`}
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}