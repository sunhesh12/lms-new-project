#!/bin/bash

# LMS Project Setup Script

echo "🚀 Starting LMS project setup..."

# 1. Install PHP dependencies
echo "📦 Installing PHP dependencies..."
composer install

# 2. Install Node dependencies
echo "📦 Installing Node dependencies..."
npm install

# 3. Environment configuration
if [ ! -f .env ]; then
    echo "📄 Creating .env file..."
    cp .env.example .env
    php artisan key:generate
else
    echo "✅ .env file already exists."
fi

# 4. Database initialization
echo "🗄️ Initializing database..."
# Check if sqlite is forced or mysql is unavailable
read -p "Do you want to use SQLite for a quick setup? (y/n): " use_sqlite

if [ "$use_sqlite" = "y" ]; then
    touch database/database.sqlite
    sed -i 's/DB_CONNECTION=mysql/DB_CONNECTION=sqlite/g' .env
    sed -i 's/DB_DATABASE=lms_db/DB_DATABASE=database\/database.sqlite/g' .env
    php artisan migrate:fresh --seed
else
    echo "⚠️ Please ensure your MySQL database is created and configured in .env"
    read -p "Press [Enter] after you have configured .env to run migrations..."
    php artisan migrate:fresh --seed
fi

# 5. Storage link
echo "🔗 Linking storage..."
php artisan storage:link

# 6. Build assets
echo "🏗️ Building assets..."
npm run build

echo "✨ Setup complete! You can now run 'php artisan serve' and 'npm run dev' to start developing."
