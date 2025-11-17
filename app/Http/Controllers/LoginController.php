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
        return Inertia::render('Dashboard');
    }
}
