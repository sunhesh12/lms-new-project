# Learning Management System (LMS)

A modern, feature-rich Learning Management System built with Laravel 11, React, and Inertia.js.

## Features

- 📚 **Course & Module Management** - Create and manage courses, modules, topics, and assignments
- 👥 **User Management** - Role-based access control (Admin, Lecturer, Student)
- 💬 **Real-time Chat** - Direct messaging and group conversations with online status
- 📅 **Calendar & Events** - Schedule and track academic events
- 📝 **Assignments & Quizzes** - Create, submit, and grade assignments with quiz support
- 🤖 **AI Assistant** - Integrated AI chat support (Gemini, OpenAI, Groq, DeepSeek)
- 📊 **Social Feed** - Share posts, status updates, and interact with the community
- 🔔 **Notifications** - Email notifications for important events
- 🔐 **Two-Factor Authentication** - Enhanced security with 2FA
- 📱 **Responsive Design** - Modern glassmorphism UI that works on all devices

## Tech Stack

- **Backend**: Laravel 11.x, PHP 8.2+
- **Frontend**: React 18, Inertia.js, CSS Modules
- **Database**: MySQL / SQLite
- **Real-time**: Laravel Echo, Pusher
- **Build Tool**: Vite
- **Authentication**: Laravel Sanctum

## Requirements

- PHP >= 8.2
- Composer
- Node.js >= 18.x
- MySQL 8.0+ or SQLite
- (Optional) Pusher account for real-time features

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/lms-new-project.git
cd lms-new-project
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

### 3. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Configure Database

**Option A: MySQL (Recommended for Production)**

1. Create a MySQL database:
   ```sql
   CREATE DATABASE lms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. Update `.env` file:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=lms_db
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```

**Option B: SQLite (Quick Setup)**

1. Create SQLite database file:
   ```bash
   touch database/database.sqlite
   ```

2. Update `.env` file:
   ```env
   DB_CONNECTION=sqlite
   DB_DATABASE=database/database.sqlite
   ```

### 5. Run Migrations & Seeders

```bash
# Run migrations
php artisan migrate

# Seed the database with sample data
php artisan db:seed
```

**Default Admin Credentials:**
- Email: `admin@lms.com`
- Password: `password123`

**Test User Credentials:**
- Email: `abc@gmail.com`
- Password: `password123`

### 6. Storage Setup

```bash
# Create symbolic link for storage
php artisan storage:link
```

### 7. Build Frontend Assets

```bash
# Development
npm run dev

# Production
npm run build
```

### 8. Start the Application

```bash
# Start Laravel development server
php artisan serve

# In a separate terminal, start the queue worker
php artisan queue:work
```

Visit: http://localhost:8000

## Optional Configuration

### AI Assistant Setup

To enable the AI Assistant feature, add an API key for your preferred provider:

1. Get an API key from:
   - **Gemini**: https://makersuite.google.com/app/apikey
   - **OpenAI**: https://platform.openai.com/api-keys
   - **Groq**: https://console.groq.com/keys
   - **DeepSeek**: https://platform.deepseek.com/api_keys

2. Update `.env`:
   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your_api_key_here
   ```

### Real-time Chat Setup (Pusher)

1. Sign up for free at https://pusher.com
2. Create a new app
3. Update `.env` with your credentials:
   ```env
   PUSHER_APP_ID=your_app_id
   PUSHER_APP_KEY=your_app_key
   PUSHER_APP_SECRET=your_app_secret
   PUSHER_APP_CLUSTER=mt1
   
   VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
   VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
   ```

4. Rebuild frontend assets:
   ```bash
   npm run build
   ```

### Email Configuration

**Development (Default - Log Driver):**

By default, emails are written to `storage/logs/laravel.log` instead of being sent. This avoids rate limits and doesn't require any mail server.

To view emails:
```bash
# Watch the log file in real-time
tail -f storage/logs/laravel.log
```

**Development (MailHog - Optional):**

If you want to preview emails in a web interface:

1. Download MailHog from https://github.com/mailhog/MailHog/releases
2. Run `MailHog_windows_amd64.exe` (starts on port 1025 for SMTP, 8025 for web UI)
3. Update `.env`:
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=127.0.0.1
   MAIL_PORT=1025
   MAIL_USERNAME=null
   MAIL_PASSWORD=null
   MAIL_ENCRYPTION=null
   ```
4. Restart queue worker: `php artisan queue:work`
5. View emails at http://localhost:8025

**Production:**

Update `.env` with your SMTP credentials:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@yourdomain.com"
```

## Development

### Running Tests

```bash
php artisan test
```

### Code Style

```bash
# Fix code style
./vendor/bin/pint
```

### Clear Caches

```bash
# Clear all caches
php artisan optimize:clear

# Or individually
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
```

## Project Structure

```
├── app/
│   ├── Http/Controllers/     # Application controllers
│   ├── Models/               # Eloquent models
│   ├── Events/               # Broadcast events
│   └── Notifications/        # Email notifications
├── database/
│   ├── migrations/           # Database migrations
│   └── seeders/             # Database seeders
├── resources/
│   ├── js/
│   │   ├── Pages/           # Inertia.js page components
│   │   ├── components/      # Reusable React components
│   │   └── css/            # CSS modules
│   └── views/              # Blade templates
├── routes/
│   ├── web.php             # Web routes
│   └── channels.php        # Broadcast channels
└── public/                 # Public assets
```

## Common Issues & Solutions

### Issue: "SQLSTATE[HY000] [2002] Connection refused"
**Solution**: Make sure MySQL is running or switch to SQLite

### Issue: "Mix file not found"
**Solution**: Run `npm run build` to compile assets

### Issue: "Class 'Redis' not found"
**Solution**: Install Redis PHP extension or change `CACHE_STORE=database` in `.env`

### Issue: Real-time features not working
**Solution**: 
1. Ensure queue worker is running: `php artisan queue:work`
2. Check Pusher credentials in `.env`
3. Rebuild frontend: `npm run build`

### Issue: Emails not sending
**Solution**: Check `MAIL_MAILER=log` in `.env` for development, or configure SMTP for production

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Support

For issues and questions, please open an issue on GitHub.
