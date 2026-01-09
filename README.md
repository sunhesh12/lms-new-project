# 📚 Professional Learning Management System (LMS)

[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

A premium, modern Learning Management System built with **Laravel**, **React**, and **Inertia.js**. Featuring a sophisticated "Professional" UI theme with glassmorphism, fully integrated AI capabilities, and enterprise-grade security.

Developed by **Kalhara** and **Heshan**.

---

## ✨ Key Features

### 🎨 Premium User Experience
*   **Glassmorphism UI**: A centralized, modern design language with translucent cards and vibrancy.
*   **Responsive Design**: Fully optimized for desktop, tablet, and mobile experiences.
*   **Interactive Feed**: Campus social feed with stories, reactions, and threaded comments.

### 🤖 Academic AI Assistant
*   **Dynamic Provider Support**: Admins can configure multiple AI providers (OpenAI, Gemini, Anthropic, etc.) directly from the dashboard.
*   **Contextual Chat**: AI Assistant knows the user's role and can assist with academic tasks.
*   **Smart Fallbacks**: Robust error handling and provider management.

### 🔐 Enterprise Security
*   **Two-Factor Authentication (2FA)**: Secure login with email-based verification codes.
*   **Data Encryption**: User PII (Personally Identifiable Information) like email and phone are encrypted at rest.
*   **Secure Recovery**: Full "Forgot Password" flow with encrypted email lookup support.

### 👥 User Management
*   **Realistic Seeding**: System comes pre-seeded with AI-generated professional profile pictures.
*   **Default Avatars**: New users automatically get a clean, professional default avatar.
*   **Role-Based Access**: Granular permissions for System Admins, Lecturers, and Students.

---

## 🛠️ Tech Stack

*   **Backend:** Laravel 12.x (PHP 8.2+)
*   **Frontend:** React (Hooks), Inertia.js, Vite
*   **Database:** MySQL
*   **Styling:** Custom CSS Modules & CSS Variables (Centralized System)
*   **Real-time:** Pusher / Laravel Echo
*   **AI Integration:** Guzzle / REST APIs

---

## 🚀 Installation & Setup

### 1. Clone & Install
```bash
git clone https://github.com/sunhesh12/lms-new-project.git
cd lms-new-project
composer install
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
php artisan key:generate
```
> **Note:** Update your `.env` file with your database credentials (`DB_DATABASE`, `DB_USERNAME`, etc.) and optional AI API keys (`GEMINI_API_KEY`).

### 3. Database & Assets
```bash
php artisan migrate:fresh --seed
php artisan storage:link
npm run build
```

### 4. Run Application
*   **Backend**: `php artisan serve`
*   **Frontend**: `npm run dev`

---

## 👥 Default Login Credentials

Access the system immediately with these pre-configured accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **System Admin** | `admin@lms.com` | `admin123` |
| **Student** | `student@lms.com` | `password123` |
| **Lecturer** | `lecturer@lms.com` | `password123` |

---

## 🤝 Project Team
*   **Kalhara** – Backend Architecture, Security & AI Logic
*   **Heshan** – UI/UX Engineering, Frontend Systems & Theming

---

## 📜 License
This project is licensed under the MIT License.
