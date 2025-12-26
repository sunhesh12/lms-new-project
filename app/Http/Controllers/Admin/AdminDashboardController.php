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
        ];

        $recent_users = User::with(['student', 'lecture', 'system_admin'])
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
                ->filter(function($a) { return $a->submissions_count > 0; });

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
                $notifications[] = [
                    'id' => 'event_' . $event->id,
                    'topic' => 'Event',
                    'message' => "{$event->title} on {$event->date->format('M d')}",
                    'type' => 'noting',
                    'link' => '/calendar',
                    'date' => $event->date,
                ];
            }
        }

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recent_users' => $recent_users,
            'notifications' => $notifications
        ]);
    }

    public function users()
    {
        return Inertia::render('Admin/Users', [
            'users' => User::with(['student', 'lecture', 'system_admin'])->get()
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
        $user->system_admin()->delete();

        // Add new role
        switch ($request->role) {
            case 'admin':
                $user->system_admin()->create(['type' => 'super_admin']);
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
}
