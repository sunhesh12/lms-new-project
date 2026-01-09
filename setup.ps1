# LMS Project Setup Script (Windows PowerShell)

Write-Host "🚀 Starting LMS project setup..." -ForegroundColor Cyan

# 1. Install PHP dependencies
Write-Host "📦 Installing PHP dependencies..." -ForegroundColor Yellow
composer install

# 2. Install Node dependencies
Write-Host "📦 Installing Node dependencies..." -ForegroundColor Yellow
npm install

# 3. Environment configuration
if (-not (Test-Path .env)) {
    Write-Host "📄 Creating .env file..." -ForegroundColor Cyan
    Copy-Item .env.example .env
    php artisan key:generate
} else {
    Write-Host "✅ .env file already exists." -ForegroundColor Green
}

# 4. Database initialization
Write-Host "🗄️ Initializing database..." -ForegroundColor Yellow
$useSqlite = Read-Host "Do you want to use SQLite for a quick setup? (y/n)"

if ($useSqlite -eq "y") {
    if (-not (Test-Path database/database.sqlite)) {
        New-Item -Path database/database.sqlite -ItemType File
    }
    (Get-Content .env) -replace 'DB_CONNECTION=mysql', 'DB_CONNECTION=sqlite' | Set-Content .env
    (Get-Content .env) -replace 'DB_DATABASE=lms_db', 'DB_DATABASE=database/database.sqlite' | Set-Content .env
    php artisan migrate:fresh --seed
} else {
    Write-Host "⚠️ Please ensure your MySQL database is created and configured in .env" -ForegroundColor Red
    Read-Host "Press [Enter] after you have configured .env to run migrations..."
    php artisan migrate:fresh --seed
}

# 5. Storage link
Write-Host "🔗 Linking storage..." -ForegroundColor Yellow
php artisan storage:link

# 6. Build assets
Write-Host "🏗️ Building assets..." -ForegroundColor Yellow
npm run build

Write-Host "✨ Setup complete! You can now run 'php artisan serve' and 'npm run dev' to start developing." -ForegroundColor Green
