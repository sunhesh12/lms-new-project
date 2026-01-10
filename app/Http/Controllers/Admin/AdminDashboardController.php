<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Module;
use App\Models\Course;
use App\Models\student;
use App\Models\lecture;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $notifications = [];

        $stats = [
            'total_users' => User::count(),
            'total_students' => student::count(),
            'total_lecturers' => lecture::count(),
            'total_courses' => Course::count(),
            'total_modules' => Module::count(),
            'active_users' => User::where('status', 'active')->count(),
            'blocked_users' => User::where('status', 'blocked')->count(),
        ];

        $popular_modules = Module::withCount('students')
            ->orderBy('students_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($module) {
                return [
                    'id' => $module->id,
                    'name' => $module->name,
                    'code' => $module->module_code,
                    'enrolled_count' => $module->students_count,
                ];
            });

        $recent_users = User::with(['student', 'lecture', 'systemAdmin'])
            ->latest()
            ->limit(5)
            ->get();

        if ($user->isLecturer()) {
            $lecture = $user->lecture;
            $moduleIds = $lecture->modules()->pluck('module_id');

            // 1. Fetch modules taught
            $taughtModules = Module::whereIn('id', $moduleIds)->get();

            // 2. Fetch ungraded assignments (next 7 days or past)
            $ungradedAssignments = \App\Models\Assignment::whereIn('module_id', $moduleIds)
                ->withCount('submissions')
                ->get()
                ->filter(function ($a) {
                    return $a->submissions_count > 0;
                });

            foreach ($ungradedAssignments as $assignment) {
                $notifications[] = [
                    'id' => 'grading_' . $assignment->id,
                    'topic' => 'Grading Required',
                    'message' => "{$assignment->submissions_count} submissions ready for {$assignment->title}",
                    'type' => 'error',
                    'link' => route('module.show', $assignment->module_id),
                    'date' => $assignment->deadline,
                ];
            }

            // 3. Upcoming events for lecturer
            $upcomingEvents = $user->events()
                ->where('date', '>=', now()->toDateString())
                ->orderBy('date')
                ->limit(5)
                ->get();

            foreach ($upcomingEvents as $event) {
                $dateFormatted = $event->date instanceof \Carbon\Carbon ? $event->date->format('M d') : \Carbon\Carbon::parse($event->date)->format('M d');
                $notifications[] = [
                    'id' => 'event_' . $event->id,
                    'topic' => 'Event',
                    'message' => "{$event->title} on {$dateFormatted}",
                    'type' => 'noting',
                    'link' => '/calendar',
                    'date' => $event->date,
                ];
            }
        }

        // --- Chart Data Aggregation ---

        // 1. User Registration Trend (Last 30 days)
        $registrations = User::selectRaw('DATE(created_at) as date, count(*) as count')
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $registrationTrends = $registrations->map(function ($reg) {
            return ['date' => $reg->date, 'count' => (int) $reg->count];
        });

        // 2. Role Distribution
        $roleDistribution = [
            ['role' => 'Students', 'count' => $stats['total_students']],
            ['role' => 'Lecturers', 'count' => $stats['total_lecturers']],
            ['role' => 'Admins', 'count' => User::has('systemAdmin')->count()],
        ];

        // 3. Modules per Course
        $modulesPerCourse = Course::withCount('modules')
            ->limit(10)
            ->get()
            ->map(function ($course) {
                return ['course' => $course->title, 'count' => $course->modules_count];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recent_users' => $recent_users,
            'popular_modules' => $popular_modules,
            'notifications' => $notifications,
            'charts' => [
                'registrationTrends' => $registrationTrends,
                'roleDistribution' => $roleDistribution,
                'modulesPerCourse' => $modulesPerCourse,
            ]
        ]);
    }

    public function users()
    {
        return Inertia::render('Admin/Users', [
            'users' => User::with(['student', 'lecture', 'systemAdmin'])->get()
        ]);
    }

    public function updateUserRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:admin,lecturer,student'
        ]);

        // Remove existing roles
        $user->student()->delete();
        $user->lecture()->delete();
        $user->systemAdmin()->delete();

        // Add new role
        switch ($request->role) {
            case 'admin':
                $user->systemAdmin()->create(['type' => 'super_admin']);
                break;
            case 'lecturer':
                $user->lecture()->create(['faculty_id' => null]); // Default null or handle faculty assignment
                break;
            case 'student':
                $user->student()->create(['academic_year' => date('Y')]);
                break;
        }

        return redirect()->back()->with('message', "User role updated to {$request->role}");
    }

    public function toggleStatus(User $user)
    {
        $newStatus = $user->status === 'active' ? 'blocked' : 'active';
        $user->update(['status' => $newStatus]);

        return redirect()->back()->with('message', "User status updated to {$newStatus}");
    }

    public function editUser(User $user)
    {
        // Load relationships
        $user->load(['student.enrolledModules.module', 'lecture.modules', 'systemAdmin']);

        // Format enrolled modules for student if they are a student
        $enrolledModules = [];
        if ($user->isStudent() && $user->student) {
            $enrolledModules = $user->student->enrolledModules->map(function ($module) {
                return [
                    'id' => $module->id,
                    'name' => $module->name,
                    'code' => $module->module_code,
                    'status' => $module->pivot->status,
                    'enrolled_at' => $module->pivot->created_at->format('M d, Y')
                ];
            });
        }

        return Inertia::render('Admin/Users/Edit', [
            'managedUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
                'can_upload_feed' => $user->can_upload_feed ?? true,
                'upload_blocked_until' => $user->upload_blocked_until ? $user->upload_blocked_until->toDateTimeString() : null,
                'address' => $user->address,
                'user_phone_no' => $user->user_phone_no,
                'user_dob' => $user->user_dob,
                'avatar_url' => $user->avatar_url,
                'index_number' => $user->index_number,
                'registration_number' => $user->registration_number,
                'enrolled_modules' => $enrolledModules,
            ]
        ]);
    }

    public function updateUser(Request $request, User $user)
    {
        // Generate blind index for unique validation check
        $emailBindex = User::generateBlindIndex($request->email);
        $request->merge(['email_bindex' => $emailBindex]);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'email_bindex' => 'unique:users,email_bindex,' . $user->id,
            'address' => 'nullable|string',
            'user_phone_no' => 'nullable|string',
            'user_dob' => 'nullable|date',
            'status' => 'required|in:active,blocked',
            'can_upload_feed' => 'nullable|boolean',
            'upload_blocked_until' => 'nullable|date',
            'role' => 'required|in:admin,lecturer,student',
            'index_number' => 'nullable|string|max:255',
            'registration_number' => 'nullable|string|max:255',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'address' => $request->address,
            'user_phone_no' => $request->user_phone_no,
            'user_dob' => $request->user_dob,
            'status' => $request->status,
            'can_upload_feed' => $request->has('can_upload_feed') ? (bool) $request->can_upload_feed : true,
            'upload_blocked_until' => $request->upload_blocked_until ? \Carbon\Carbon::parse($request->upload_blocked_until) : null,
            'index_number' => $request->index_number,
            'registration_number' => $request->registration_number,
        ]);

        // Update role if changed
        if ($request->role !== $user->role) {
            $user->student()->delete();
            $user->lecture()->delete();
            $user->systemAdmin()->delete();

            switch ($request->role) {
                case 'admin':
                    $user->systemAdmin()->create(['type' => 'super_admin']);
                    break;
                case 'lecturer':
                    $user->lecture()->create(['faculty_id' => null]);
                    break;
                case 'student':
                    $user->student()->create(['academic_year' => date('Y')]);
                    break;
            }
        }

        return redirect()->route('admin.users.index')->with('message', 'User updated successfully');
    }

    public function systemHealth()
    {
        $health = [
            'status' => 'OK',
            'server_time' => now()->toDateTimeString(),
            'php_version' => PHP_VERSION,
            'database' => \DB::connection()->getPdo() ? 'Connected' : 'Error',
            'storage_status' => is_writable(storage_path()) ? 'Writable' : 'Read-Only',
        ];

        return Inertia::render('Admin/SystemHealth', [
            'health' => $health
        ]);
    }

    public function examinations()
    {
        $assignments = \App\Models\Assignment::with('module:id,name')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'Assignment',
                    'title' => $item->title,
                    'module_name' => $item->module->name ?? 'N/A',
                    'deadline' => $item->deadline,
                    'edit_url' => route('module.show', $item->module_id), // Or specific edit route
                ];
            });

        $quizzes = \App\Models\Quiz::with('module:id,name')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'Quiz',
                    'title' => $item->title,
                    'module_name' => $item->module->name ?? 'N/A',
                    'deadline' => $item->deadline,
                    'edit_url' => route('module.show', $item->module_id), // Or specific edit route
                ];
            });

        $examinations = $assignments->concat($quizzes)->sortByDesc('deadline')->values();

        return Inertia::render('Admin/Examinations', [
            'examinations' => $examinations
        ]);
    }
}
