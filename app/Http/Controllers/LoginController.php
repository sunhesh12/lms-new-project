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

    $cookie = cookie('user_email', $user->email, 60 * 24 * 7);

    return redirect()->route('dashboard')->withCookie($cookie);;
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
        $notifications = [];

        if ($user->isStudent()) {
            $student = $user->student;
            
            // 1. Fetch upcoming assignments for enrolled modules (next 14 days)
            $enrolledModuleIds = \App\Models\ModuleEnrollment::where('student_id', $student->id)->pluck('module_id');
            
            $upcomingAssignments = \App\Models\Assignment::whereIn('module_id', $enrolledModuleIds)
                ->where('deadline', '>', now())
                ->where('deadline', '<', now()->addDays(14))
                ->with('module')
                ->get();

            foreach ($upcomingAssignments as $assignment) {
                $notifications[] = [
                    'id' => 'assignment_' . $assignment->id,
                    'topic' => 'Assignment Due',
                    'message' => "{$assignment->title} is due on {$assignment->deadline->format('M d, H:i')}",
                    'type' => 'error', // Use error for deadlines
                    'link' => route('module.show', $assignment->module_id),
                    'date' => $assignment->deadline,
                ];
            }

            // 2. Fetch active quizzes for enrolled modules
            $upcomingQuizzes = \App\Models\Quiz::whereIn('module_id', $enrolledModuleIds)
                ->where('is_active', true)
                ->with('module')
                ->get();

            foreach ($upcomingQuizzes as $quiz) {
                $notifications[] = [
                    'id' => 'quiz_' . $quiz->id,
                    'topic' => 'Active Quiz',
                    'message' => "{$quiz->title} is available in {$quiz->module->name}",
                    'type' => 'success',
                    'link' => route('modules.quiz', ['initialQuizId' => $quiz->id]),
                    'date' => $quiz->created_at,
                ];
            }

            // 3. Fetch user-specific events
            $upcomingEvents = $user->events()
                ->where('date', '>=', now()->toDateString())
                ->orderBy('date')
                ->orderBy('start_time')
                ->limit(5)
                ->get();

            foreach ($upcomingEvents as $event) {
                $notifications[] = [
                    'id' => 'event_' . $event->id,
                    'topic' => 'Event',
                    'message' => "{$event->title} on {$event->date->format('M d')} at {$event->start_time->format('H:i')}",
                    'type' => 'noting',
                    'link' => '/calendar',
                    'date' => $event->date,
                ];
            }
        }

        // Sort notifications by date (newest first or closest deadline)
        usort($notifications, function($a, $b) {
            return $a['date'] <=> $b['date'];
        });

        return Inertia::render('Dashboard', [
            'notifications' => $notifications
        ]);
    }
}
