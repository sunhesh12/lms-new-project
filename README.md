# Learning Management System (LMS)

A Laravel-based Learning Management System used for assignments, quizzes, messaging, events and course management.

---

## Quick Links
- **Project:** Learning Management System
- **Repo path:** [README.md](README.md)

---

## Features
- User authentication (login/logout)
- Two-factor authentication (email-based 2FA)
- Role management: Admin, Lecturer, Student
- Assignments, submissions and grading
- Quizzes and attempts
- Messaging and conversations with unread counts
- Events calendar and notifications
- File uploads and resource management
- Notifications via database/mail

---

## Technology Stack
- PHP 8.2+
- Laravel 12.x
- MySQL
- Inertia.js + Vue (frontend scaffolding in resources)
- Node.js / Vite for assets

---

## Prerequisites
- PHP >= 8.2
- Composer
- Node.js >= 16 and npm/yarn
- MySQL (or compatible database)
- Git

---

## Installation (Development)

1. Clone the repo

```bash
git clone https://github.com/sunhesh12/lms-new-project.git
cd lms-new-project
```

2. Install PHP dependencies

```bash
composer install
```

3. Install Node dependencies and build assets (development)

```bash
npm install
npm run dev
```

4. Copy `.env` and configure

```bash
cp .env.example .env
```

Edit `.env` and set database, mail and app values (examples below).

5. Generate app key

```bash
php artisan key:generate
```

6. Run migrations and seeders

```bash
php artisan migrate --seed
```

7. Link storage (if using local storage for uploads)

```bash
php artisan storage:link
```

8. Start development server

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

Open http://127.0.0.1:8000

---

## Environment Variables (example)

Edit `.env` with values similar to below:

```
APP_NAME="Learning Management System"
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lms
DB_USERNAME=root
DB_PASSWORD=secret

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=hello@example.com
MAIL_FROM_NAME="LMS"

QUEUE_CONNECTION=database

```

---

## Two-Factor Authentication (2FA)

This project uses an email-based 2FA flow. After successful login the system calls `generateTwoFactorCode()` on the `User` model, sends the code via email and redirects the user to the 2FA challenge page.

If you need to debug 2FA in development, you can:

- Use Mailtrap or a local SMTP server and set `MAIL_*` values accordingly.
- Temporarily log or dd the generated `two_factor_code` in the code (only in local/dev).

---

## Running Tests

Unit and feature tests use PHPUnit. Run:

```bash
./vendor/bin/phpunit
```

Or on Windows Powershell:

```powershell
.
vendor\bin\phpunit
```

---

## Common Commands

- Install PHP deps: `composer install`
- Install JS deps: `npm install`
- Build assets (dev): `npm run dev`
- Build assets (prod): `npm run build` or `npm run prod`
- Run migrations: `php artisan migrate`
- Run seeders: `php artisan db:seed`
- Serve: `php artisan serve`
- Run tests: `vendor/bin/phpunit`

---

## Database Seeding & Default Accounts

Seeders should create initial users and sample data. Check `database/seeders` for exact classes. After running `php artisan migrate --seed`, look for seeded admin user (commonly `admin@lms.com`).

---

## Screenshots

Place screenshots inside `public/screenshots` (create the folder) and name them descriptively. Example image links are below — replace with actual images once available:

![Login Page](/screenshots/login.svg)
![Two Factor Challenge](/screenshots/two_factor.svg)
![Dashboard](/screenshots/dashboard.svg)
![Assignment Submission](/screenshots/assignment_submission.svg)

Notes:
- On Windows the public path will be served by `php artisan serve` and image URLs will be `/screenshots/<name>.png` when placed in `public/screenshots`.

---

## Deployment Tips

- Set `APP_ENV=production` and `APP_DEBUG=false`.
- Use a proper process manager (Supervisor) for queues.
- Use `php artisan config:cache`, `route:cache`, `view:cache` in production.
- Ensure `storage` and `bootstrap/cache` are writable by the web server.

---

## Troubleshooting

- 2FA errors: ensure `two_factor_code` column exists on `users` table and mail is configured.
- Permission issues: run `chown -R www-data:www-data storage bootstrap/cache` (Linux) or ensure IIS/Apache user has write permissions on Windows.
- Queue email not sending: ensure `QUEUE_CONNECTION` is configured and worker is running: `php artisan queue:work`.

If you encounter an error like `Call to undefined method App\\Models\\User::generateTwoFactorCode()`, ensure the `generateTwoFactorCode()` and `resetTwoFactorCode()` methods exist on `app/Models/User.php`.

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Open a pull request with a clear description and tests

---

## License

This project does not include a license file. Add a LICENSE if you wish to make terms explicit.

---

## Contact / Support

For issues and feature requests please open an issue on the repository.

---

_README generated by project maintainer helper — edit sections and replace screenshot placeholders with actual images in `public/screenshots`._
# 📚 Learning Management System (LMS)

A web-based **Learning Management System** built with **Laravel** (backend) and **React** (frontend) to streamline course management, student engagement, and academic workflows.

Developed by **Kalhara** and **Heshan**.

---

## ✨ Features

* 🔑 **User Authentication** – Secure login for students and admins
* 📖 **Course Management** – Add, update, and manage courses
* 👩‍🎓 **Student Enrollment** – Students can enroll in available courses
* 📂 **Assignments & Materials** – Upload and download learning resources
* 📝 **Quizzes & Exams** – Manage and attempt quizzes online
* 📊 **Grades & Reports** – View and manage performance records

---

## 🛠️ Tech Stack

* **Frontend:** React, TailwindCSS / Bootstrap
* **Backend:** Laravel (PHP)
* **Database:** MySQL
* **Other Tools:** Git, GitHub, Composer, Node.js, npm

---

## 🚀 Installation & Setup

### 🔹 Prerequisites

Make sure you have installed:

* [PHP 8+](https://www.php.net/)
* [Composer](https://getcomposer.org/)
* [Node.js & npm](https://nodejs.org/)
* [MySQL](https://dev.mysql.com/)

---

### 🔹 Backend (Laravel)

1. Clone the repository and move into project folder

   ```bash
   git clone https://github.com/username/lms-new-project.git
   cd lms-project/backend
   ```

2. Install dependencies

   ```bash
   composer install
   ```

3. Copy `.env.example` to `.env` and update DB settings

   ```bash
   cp .env.example .env
   ```

4. Generate application key

   ```bash
   php artisan key:generate
   ```

5. Run database migrations & seeders

   ```bash
   php artisan migrate --seed
   ```

6. Start Laravel server

   ```bash
   php artisan serve
   ```

   Backend will be available at 👉 `http://127.0.0.1:8000`

---

### 🔹 Frontend (React)

1. Go to frontend folder

   ```bash
   cd ../frontend
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start React development server

   ```bash
   npm start
   ```

   Frontend will be available at 👉 `http://localhost:3000`

---

### other dependencies 

1. react router dom 

   ```bash
   npm install react-router-dom 
   ```

2. add shadcn css for css framework

   ```bash
   npx shadcn@latest add switch
   ```
---

### 🔹 Connecting React with Laravel

* Update API base URL in React (`frontend/src/config.js` or `.env`) to point to your Laravel backend:

  ```
  REACT_APP_API_URL=http://127.0.0.1:8000/api
  ```

---

## 👥 Contributors

* **Kalhara** – Backend Development, Database Management
* **Heshan** – Frontend Development, UI/UX Design

---

## 📜 License

This project is licensed under the MIT License.

---
