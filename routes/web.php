<?php

use App\Http\Controllers\homeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\LoginController;

// Route::get('/', function () {
//     return Inertia::render('home', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// //login routes
// // Route::get('/login', [LoginController::class, 'index'])->name('login.show');



// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// All the routes related modules
Route::prefix('modules')->group(function () {
    Route::prefix('/{moduleId}')->group(function () {
        Route::get('/', function ($moduleId) {
            return Inertia::render('Modules/Main', ['moduleId' => $moduleId]);
        });

        Route::get('/assignments/{assignmentId}', function ($moduleId, $assignmentId) {
            return Inertia::render('Modules/Assignment', [
                'moduleId' => $moduleId,
                'assignmentId' => $assignmentId
            ]);
        });
    });
});

Route::get('/calendar', function () {
    return Inertia::render('Calendar/Main');
});

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

// Route::get('/Courses', function () {
//     return Inertia::render('Course');
// })->middleware(['auth', 'verified'])->name('Courses');



// ===========================New controllers for the project==============================================

Route::get('/', [homeController::class, 'index'])->name('home');

Route::get('/login', [LoginController::class, 'index'])->name('login');


Route::get('/register', function () {
    return Inertia::render('Auth/Register')->name('register');
});


require __DIR__ . '/auth.php';
