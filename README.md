# 📚 Learning Management System (LMS)

A modern, web-based Learning Management System built with **Laravel**, **React**, and **Inertia.js**. This system streamlines course management, student engagement, and academic workflows.

Developed by **Kalhara** and **Heshan**.

---

## ✨ Features

* 🔑 **Authentication & Security** – Secure login with email-based Two-Factor Authentication (2FA).
* 👩‍🎓 **Role Management** – Specialized interfaces for Admins, Lecturers, and Students.
* 📖 **Course & Module Management** – Comprehensive tools for managing courses, modules, and topics.
* 📂 **Assignments & Resources** – Upload, manage, and grade assignments with integrated resource management.
* 📝 **Quizzes & Exams** – Online quiz platform with automated attempts and scoring.
* 💬 **Messaging** – Real-time conversations and notifications.
* 🗓️ **Calendar & Events** – Integrated event management and notifications.
* 🤖 **AI Assistant** – Integrated AI support for enhanced learning and administration.

---

## 🛠️ Tech Stack

* **Backend:** Laravel 12.x (PHP 8.2+)
* **Frontend:** React, Inertia.js, TailwindCSS
* **Database:** MySQL (Compatible with SQLite for local development)
* **Real-time:** Pusher/Laravel Echo
* **Assets:** Vite

---

## 🚀 Quick Start / Installation

### 🔹 Prerequisites

Ensure you have the following installed:
* [PHP 8.2+](https://www.php.net/)
* [Composer](https://getcomposer.org/)
* [Node.js & npm](https://nodejs.org/)
* [MySQL](https://dev.mysql.com/) (Optional: SQLite is supported for fast local setup)

### 🔹 Automatic Setup (Recommended)

Run the automated setup script:
```bash
bash setup.sh
```

### 🔹 Manual Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sunhesh12/lms-new-project.git
   cd lms-new-project
   ```

2. **Install Dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   *Edit `.env` and set your database connection.*

4. **Initialize Database**
   ```bash
   php artisan migrate --seed
   ```

5. **Link Storage**
   ```bash
   php artisan storage:link
   ```

6. **Start Development Servers**
   In two separate terminals:
   ```bash
   php artisan serve
   ```
   ```bash
   npm run dev
   ```

---

## 🧪 Running Tests

```bash
php artisan test
```

---

## 👥 Default Accounts (Local Dev)

After seeding the database, you can log in with:
* **Admin:** `admin@lms.com` / `admin123`
* **Test User:** `abc@gmail.com` / `password123`

---

## 👤 Contributors

* **Kalhara** – Backend Development, Database Management
* **Heshan** – Frontend Development, UI/UX Design

---

## 📜 License

This project is licensed under the MIT License.
