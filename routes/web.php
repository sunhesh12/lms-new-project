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
        })->middleware('auth');

        Route::get('/assignments/{assignmentId}', function ($moduleId, $assignmentId) {
            return Inertia::render('Modules/Assignment', [
                'moduleId' => $moduleId,
                'assignmentId' => $assignmentId
            ]);
        })->middleware('auth');
    });
})->middleware('auth');




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
