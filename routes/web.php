<?php

use App\Http\Controllers\homeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\Auth\RegisterController;



// All the routes related modules
Route::prefix('modules')->group(function () {
    Route::prefix('/{moduleId}')->group(function () {
        Route::get('/', function ($moduleId) {
            return Inertia::render('Modules/Main', ['moduleId' => $moduleId]);
        }); //->middleware('auth');

        Route::get('/assignments/{assignmentId}', function ($moduleId, $assignmentId) {
            return Inertia::render('Modules/Assignment', [
                'moduleId' => $moduleId,
                'assignmentId' => $assignmentId
            ]);
        }); //->middleware('auth');
    });
})->middleware('auth');



Route::get('/calendar', function () {
    return Inertia::render('Calendar/Main');
});

Route::get('/account', function () {
    return Inertia::render('Users/Main');
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

Route::get('/login', [LoginController::class,'index'])->name('login');
Route::post('/login', [LoginController::class,'login'])->name('login.submit');


Route::post('/logout', [LoginController::class,'logout'])->name('logout');


Route::get('/register', [RegisterController::class, 'showForm'])->name('register');
Route::post('/register', [RegisterController::class, 'submit'])->name('register.submit');

Route::get('/dashboard', [LoginController::class, 'dashboard'])->name('dashboard')->middleware('auth');


Route::get('/register', function () {
    return Inertia::render('Auth/Register')->name('register');
});


require __DIR__ . '/auth.php';
