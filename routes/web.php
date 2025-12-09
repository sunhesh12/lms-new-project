<?php

use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\homeController;
use App\Http\Controllers\ModuleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\TopicController;



// All the routes related modules
Route::prefix('modules')->group(function () {
    Route::post('/', [ModuleController::class, 'create'])->name('module.create'); //->middleware('auth');
    Route::prefix('/{moduleId}')->group(function () {
        Route::get('/', [ModuleController::class, 'show'])->name('module.show'); //->middleware('auth');
        Route::post('/', [ModuleController::class, 'update'])->name('module.update');
        Route::delete('/', [ModuleController::class, 'destroy'])->name('module.delete');

        // For creating new topics for a module
        Route::post('/topics/create', [TopicController::class, 'create'])->name("topic.create"); //->middleware('auth
        Route::post('/topics/{topicId}', [TopicController::class, 'update'])->name("topic.update");
        Route::delete('/topics/{topicId}', [TopicController::class, 'destroy'])->name("topic.delete"); //->middleware('auth
        Route::post('/topics/{topicId}/reset', [TopicController::class, 'reset'])->name("topic.reset"); //->middleware('auth

        Route::get('/assignments/{assignmentId}', function ($moduleId, $assignmentId) {
            return Inertia::render('Modules/Assignment', [
                'moduleId' => $moduleId,
                'assignmentId' => $assignmentId
            ]);
        }); //->middleware('auth');

        // For creating new assignments for a module
        Route::post("/assignments/create", [AssignmentController::class, 'create'])->name("assignment.create");

    });
});//->middleware('auth');

Route::post("/assignments/{assignmentId}/update", [AssignmentController::class, 'update'])->name("assignment.update");
Route::post("/assignments/{assignmentId}/delete", [AssignmentController::class, 'delete'])->name("assignment.delete");
Route::post("/assignments/{assignmentId}/submit", [AssignmentController::class, 'submit'])->name("assignment.submit");
Route::post("/assignments/{assignmentId}/reset", [AssignmentController::class, 'reset'])->name("assignment.reset");

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

Route::get('/login', [LoginController::class, 'index'])->name('login');
Route::post('/login', [LoginController::class, 'login'])->name('login.submit');


Route::post('/logout', [LoginController::class, 'logout'])->name('logout');


Route::get('/register', [RegisterController::class, 'showForm'])->name('register');
Route::post('/register', [RegisterController::class, 'submit'])->name('register.submit');

Route::get('/dashboard', [LoginController::class, 'dashboard'])->name('dashboard')->middleware('auth');


Route::get('/register', function () {
    return Inertia::render('Auth/Register')->name('register');
});


require __DIR__ . '/auth.php';
