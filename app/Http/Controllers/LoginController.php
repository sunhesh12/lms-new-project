<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\RateLimiter;

class LoginController extends Controller
{
    public function index()
    {
        return Inertia::render('Auth/Login');
    }

  public function login(Request $request)
{
    // ---------------------------
    // 1. Validate Required Fields
    // ---------------------------
    $request->validate([
        'email' => 'required|email',
        'password' => 'required|min:5|max:50',
        'remember' => 'boolean'
    ]);

    // ---------------------------
    // 2. Rate Limiting
    // ---------------------------

    $key = $this->Rate_Limiting($request);
    // ---------------------------
    // 3. Check If User Exists
    // ---------------------------
    $user = User::where('email', $request->email)->first();

    if (!$user) {
        RateLimiter::hit($key, 60);

        throw ValidationException::withMessages([
            'email' => 'No account found with this email.'
        ]);
    }

    // ---------------------------
    // 4. Check If User Is Blocked
    // ---------------------------
    else if ($user->status === 'blocked') {

        RateLimiter::hit($key, 60); // count attempt

        throw ValidationException::withMessages([
            'email' => 'Your account has been blocked. Please contact support.'
        ]);
    }

    // ---------------------------
    // 5. Check Password
    // ---------------------------
    else if (!Hash::check($request->password, $user->password)) {

        RateLimiter::hit($key, 60);

        throw ValidationException::withMessages([
            'password' => 'Password is incorrect.'
        ]);
    }

    else{

    // Clear attempts after success
    RateLimiter::clear($key);

    // ---------------------------
    // 6. Login User
    // ---------------------------
    Auth::login($user, $request->remember);

    // Notify user of successful login
    $user->notify(new \App\Notifications\LoginNotification());

    return redirect()->route('dashboard');
    }
}

public function Rate_Limiting(Request $request){
    $key = strtolower($request->email) . '|' . $request->ip();

    if (RateLimiter::tooManyAttempts($key, 5)) {
        $seconds = RateLimiter::availableIn($key);

        throw ValidationException::withMessages([
            'email' => "Too many attempts. Try again in $seconds seconds."
        ]);
    }

    return $key;
}




public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }



    public function dashboard()
    {
        $user = Auth::user();
        
        // 1. Check for upcoming personal events within 2 days
        $upcomingEvents = \App\Models\Event::where('user_id', $user->id)
            ->where('date', '>=', now()->toDateString())
            ->where('date', '<=', now()->addDays(2)->toDateString())
            ->get();

        foreach ($upcomingEvents as $event) {
            // Check if a notification for this event already exists to avoid duplicates
            // We can use the created_at or some other logic, but for simplicity, 
            // lets just check if there's a notification with this title and date in data
            $alreadyNotified = $user->notifications()
                ->where('data->event_id', $event->id)
                ->exists();

            if (!$alreadyNotified) {
                $user->notify(new \App\Notifications\SystemNotification([
                    'topic' => 'Upcoming Event',
                    'message' => "Reminder: {$event->title} is scheduled for {$event->date->format('M d')} at {$event->start_time}",
                    'type' => 'noting',
                    'link' => route('calendar'), // Adjust route if named differently
                    'event_id' => $event->id,
                ]));
            }
        }

        // 2. Also check for PUBLIC events from others within 2 days
        $publicEvents = \App\Models\Event::where('user_id', '!=', $user->id)
            ->where('visibility', 'public')
            ->where('date', '>=', now()->toDateString())
            ->where('date', '<=', now()->addDays(2)->toDateString())
            ->get();

        foreach ($publicEvents as $event) {
            $alreadyNotified = $user->notifications()
                ->where('data->event_id', $event->id)
                ->exists();

            if (!$alreadyNotified) {
                $user->notify(new \App\Notifications\SystemNotification([
                    'topic' => 'Public Event',
                    'message' => "Public Event: {$event->title} by {$event->user->name} on {$event->date->format('M d')}",
                    'type' => 'noting',
                    'link' => route('calendar'),
                    'event_id' => $event->id,
                ]));
            }
        }

        // Fetch real database notifications for the view
        $notifications = $user->notifications()->latest()->limit(10)->get();

        // If no database notifications and user is student, generate sample assignments
        if ($notifications->isEmpty() && $user->isStudent()) {
            $student = $user->student;
            $enrolledModuleIds = \App\Models\ModuleEnrollment::where('student_id', $student->id)->pluck('module_id');
            
            $upcomingAssignments = \App\Models\Assignment::whereIn('module_id', $enrolledModuleIds)
                ->where('deadline', '>', now())
                ->where('deadline', '<', now()->addDays(14))
                ->with('module')
                ->limit(3)
                ->get();

            foreach ($upcomingAssignments as $assignment) {
                $user->notify(new \App\Notifications\SystemNotification([
                    'topic' => 'Assignment Due',
                    'message' => "{$assignment->title} is due on {$assignment->deadline->format('M d, H:i')}",
                    'type' => 'error',
                    'link' => route('module.show', $assignment->module_id),
                ]));
            }

            // Re-fetch now that we've added some
            $notifications = $user->notifications()->latest()->limit(10)->get();
        }

        // --- Fetch Frequent Modules ---
        $frequent_modules = [];
        if ($user->isAdmin()) {
            $frequent_modules = \App\Models\Module::withCount('students')
                ->orderBy('students_count', 'desc')
                ->limit(5)
                ->get();
        } elseif ($user->isLecturer() && $user->lecture) {
            $frequent_modules = $user->lecture->modules()
                ->withCount('students')
                ->limit(5)
                ->get();
        } elseif ($user->isStudent() && $user->student) {
            $frequent_modules = $user->student->enrolledModules()
                ->limit(5)
                ->get();
        }

        return Inertia::render('Dashboard', [
            'notifications' => $notifications,
            'frequent_modules' => $frequent_modules,
        ]);
    }
}
