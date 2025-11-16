<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;


class LoginController extends Controller
{
    public function index()
    {
        return Inertia::render('Auth/Login');
    }

public function login(Request $request)
{
    // Validate inputs
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    // 1. Find user by email
    $user = User::where('email', $request->email)->first();

    // 2. Check if user exists
    if (!$user) {
        return back()->with('error', 'Email not found!');
    }

    // 3. Check password
    if (!Hash::check($request->password, $user->password)) {
        return back()->with('error', 'Incorrect password!');
    }

    // 4. Store login data in session
    session()->put('loggedUser', $user->id);

    // 5. Redirect to dashboard
    return redirect('/dashboard')->with('success', 'Login Successful!');
}
}
