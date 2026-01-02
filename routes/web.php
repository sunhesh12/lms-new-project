<?php

use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\homeController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\ModuleEnrollmentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\TopicController;
use App\Http\Controllers\EventController;
use Illuminate\Http\Request;



// All the routes related modules
Route::prefix('modules')->group(function () {
    Route::get('/', [ModuleController::class, 'index'])->name('modules.index');
    Route::post('/', [ModuleController::class, 'create'])->name('module.create'); //->middleware('auth');
    
    // Student Quiz Page (specific route must come before parameterizedmoduleId)
    Route::get('/quiz', [App\Http\Controllers\QuizController::class, 'page'])->name('modules.quiz');
    
    // Browse All Modules Page
    Route::get('/browse', [ModuleController::class, 'browse'])->name('modules.browse');

    Route::prefix('/{moduleId}')->group(function () {
        Route::get('/', [ModuleController::class, 'show'])->name('module.show'); //->middleware('auth');
        Route::get('/join', [ModuleController::class, 'joinPage'])->name('module.join_page');
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

        // Enrollments
        Route::post('/join', [ModuleController::class, 'join'])->name('module.join');
        Route::delete('/enroll/{registrationId}', [ModuleEnrollmentController::class, 'destroy'])->name('module.unenroll');
        Route::delete('/enrollments/all', [ModuleEnrollmentController::class, 'destroyAll'])->name('module.unenroll-all');
    });
});
//->middleware('auth');

Route::post("/assignments/{assignmentId}/update", [AssignmentController::class, 'update'])->name("assignment.update");
Route::post("/assignments/{assignmentId}/delete", [AssignmentController::class, 'delete'])->name("assignment.delete");
// Submission route moved to auth middleware group below (line 187)
Route::post("/assignments/{assignmentId}/reset", [AssignmentController::class, 'reset'])->name("assignment.reset");

// Grading Routes
Route::get('/modules/{moduleId}/assignments/{assignmentId}/grading', [AssignmentController::class, 'grading'])->name('assignment.grading');
Route::post('/assignments/submissions/{submissionId}/grade', [AssignmentController::class, 'storeGrade'])->name('assignment.grade.store');

Route::get('/calendar', function () {
    return Inertia::render('Calendar/Main');
})->name('calendar');

Route::get('/account', function () {
    return Inertia::render('Users/Main');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [App\Http\Controllers\ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [App\Http\Controllers\ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Route::get('/Courses', function () {
//     return Inertia::render('Course');
// })->middleware(['auth', 'verified'])->name('Courses');




// ===========================New controllers for the project==============================================

Route::get('/', [homeController::class, 'index'])->name('home');


Route::get('/login', [LoginController::class, 'index'])->name('login');
Route::post('/login', [LoginController::class, 'login'])->name('login.submit');


Route::post('/logout', [LoginController::class, 'logout'])->name('logout');


Route::get('/register', [RegisterController::class, 'showForm'])->name('register');
Route::post('/register', [RegisterController::class, 'submit'])->name('register.submit');

Route::get('/dashboard', [LoginController::class, 'dashboard'])->name('dashboard')->middleware('auth');




// // Protected routes (requires authentication)
// Route::middleware('auth:sanctum')->group(function () {
//     Route::apiResource('events', EventController::class);
    
//     // Or if you prefer explicit routes:
//     Route::get('/events', [EventController::class, 'index']);
//     Route::post('/events', [EventController::class, 'store']);
//     Route::get('/events/{event}', [EventController::class, 'show']);
//     Route::put('/events/{event}', [EventController::class, 'update']);
//     Route::patch('/events/{event}', [EventController::class, 'update']);
//     Route::delete('/events/{event}', [EventController::class, 'destroy']);
// });

Route::middleware(['auth:sanctum'])->group(function () {
    // Events API Resource routes
    Route::get('/events', [EventController::class, 'index'])->name('api.events.index');
    Route::post('/events', [EventController::class, 'store'])->name('api.events.store');
    Route::get('/events/{event}', [EventController::class, 'show'])->name('api.events.show');
    Route::put('/events/{event}', [EventController::class, 'update'])->name('api.events.update');
    Route::delete('/events/{event}', [EventController::class, 'destroy'])->name('api.events.destroy');
});



Route::middleware('auth')->group(function () {
    Route::get('/chat', [App\Http\Controllers\ChatController::class, 'index'])->name('chat.index');
    Route::post('/chat', [App\Http\Controllers\ChatController::class, 'store'])->name('chat.store');
    Route::get('/api/users/search', [App\Http\Controllers\ChatController::class, 'search'])->name('users.search');
    Route::post('/api/conversations/check', [App\Http\Controllers\ChatController::class, 'checkConversation'])->name('conversations.check');
    Route::post('/api/groups/store', [App\Http\Controllers\ChatController::class, 'storeGroup'])->name('groups.store');
    Route::post('/messages/{message}/delete-everyone', [App\Http\Controllers\ChatController::class, 'deleteForEveryone'])->name('messages.delete.everyone');
    Route::post('/messages/{message}/delete-me', [App\Http\Controllers\ChatController::class, 'deleteForMe'])->name('messages.delete.me');
    Route::post('/messages/delete-multiple', [App\Http\Controllers\ChatController::class, 'deleteMultiple'])->name('messages.delete.multiple');
    Route::post('/chat/{conversation}/read', [App\Http\Controllers\ChatController::class, 'markAsRead'])->name('chat.read');
    Route::get('/chat/{conversation}', [App\Http\Controllers\ChatController::class, 'show'])->name('chat.show');
    Route::post('/profile/update-picture', [App\Http\Controllers\ProfileController::class, 'updatePicture'])->name('profile.update-picture');
    Route::get('/api/students/search', function (Request $request) {
        $query = $request->query('query');
        return \App\Models\student::with('user')
            ->whereHas('user', function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%");
            })
            ->limit(50)
            ->get();
    })->name('students.search');

    // Search for available students (not enrolled in a specific module)
    Route::get('/api/modules/{moduleId}/available-students', [App\Http\Controllers\ModuleEnrollmentController::class, 'availableStudents'])
        ->name('module.available-students');

    // Admin Routes
    Route::middleware(['admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [App\Http\Controllers\Admin\AdminDashboardController::class, 'index'])->name('admin.dashboard');
        Route::get('/users', [App\Http\Controllers\Admin\AdminDashboardController::class, 'users'])->name('admin.users.index');
        Route::post('/users/{user}/role', [App\Http\Controllers\Admin\AdminDashboardController::class, 'updateUserRole'])->name('admin.users.role.update');
        Route::post('/users/{user}/toggle-status', [App\Http\Controllers\Admin\AdminDashboardController::class, 'toggleStatus'])->name('admin.users.status.toggle');
        Route::get('/users/{user}/edit', [App\Http\Controllers\Admin\AdminDashboardController::class, 'editUser'])->name('admin.users.edit');
        Route::post('/users/{user}/update', [App\Http\Controllers\Admin\AdminDashboardController::class, 'updateUser'])->name('admin.users.update');
        Route::get('/health', [App\Http\Controllers\Admin\AdminDashboardController::class, 'systemHealth'])->name('admin.health');
        Route::get('/examinations', [App\Http\Controllers\Admin\AdminDashboardController::class, 'examinations'])->name('admin.examinations');
    });

    Route::get('/api/lecturers/search', function (Request $request) {
        $query = $request->query('query');
        return \App\Models\lecture::with('user')
            ->whereHas('user', function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%");
            })
            ->limit(50)
            ->get();
    })->name('lecturers.search');

    Route::post('/modules/{module}/staff', [App\Http\Controllers\ModuleController::class, 'manageStaff'])->name('modules.staff.manage');
    
    // Enrollment Routes
    Route::post('/modules/{moduleId}/enroll', [App\Http\Controllers\ModuleEnrollmentController::class, 'store'])->name('module.enroll');
    Route::delete('/modules/{moduleId}/enrollments/{registrationId}', [App\Http\Controllers\ModuleEnrollmentController::class, 'destroy'])->name('module.unenroll');
    Route::post('/assignments/{assignmentId}/submit', [App\Http\Controllers\AssignmentController::class, 'submit'])->name('assignments.submit');

    // Quiz Management
    Route::post('/quizzes', [App\Http\Controllers\QuizController::class, 'store'])->name('quizzes.store');
    Route::post('/quizzes/{id}', [App\Http\Controllers\QuizController::class, 'update'])->name('quizzes.update');
    Route::delete('/quizzes/{id}', [App\Http\Controllers\QuizController::class, 'destroy'])->name('quizzes.destroy');
    Route::post('/quizzes/{id}/questions', [App\Http\Controllers\QuizController::class, 'syncQuestions'])->name('quizzes.questions.sync');
    Route::delete('/quizzes/{quizId}/questions/{questionId}', [App\Http\Controllers\QuizController::class, 'deleteQuestion'])->name('quizzes.questions.delete');

    // Notifications
    Route::get('/api/notifications', [App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/api/notifications/{id}/read', [App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/api/notifications/read-all', [App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
});




use App\Http\Controllers\QuizController;




// Redundant quiz route removed (moved above)



Route::middleware(['auth'])->group(function () {
    
    // Get all quizzes
    Route::get('/quizzes', [QuizController::class, 'index']);
    
    // Get specific quiz with questions
    Route::get('/quizzes/{id}', [QuizController::class, 'show']);
    
    // Submit quiz attempt
    Route::post('/quizzes/{id}/submit', [QuizController::class, 'submit']);
    
    // Get quiz results
    Route::get('/quiz-attempts/{attemptId}/results', [QuizController::class, 'results']);
    
    // Get user's quiz history
    Route::get('/quiz-history', [QuizController::class, 'history']);
});



require __DIR__ . '/auth.php';
