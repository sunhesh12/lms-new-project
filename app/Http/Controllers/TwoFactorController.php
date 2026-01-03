<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\TwoFactorCodeMail;

class TwoFactorController extends Controller
{
    public function index()
    {
        return Inertia::render('Auth/TwoFactorChallenge');
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $user = auth()->user();

        if ($request->code == $user->two_factor_code) {
            
            if ($user->two_factor_expires_at < now()) {
                return back()->withErrors(['code' => 'The two factor code has expired. Please request a new one.']);
            }

            $user->resetTwoFactorCode();
            session(['2fa_verified' => true]);

            // Notify user of successful login
            $user->notify(new \App\Notifications\LoginNotification());

            return redirect()->route('dashboard');
        }

        return back()->withErrors(['code' => 'The two factor code you have entered does not match.']);
    }

    public function resend()
    {
        $user = auth()->user();
        $user->generateTwoFactorCode();
        
        // Mail::to($user->email)->send(new TwoFactorCodeMail($user->two_factor_code)); // This should handle the email sending
        // Alternatively, reuse the logic from LoginController if we want to centralize it
        try {
             Mail::to($user->email)->send(new TwoFactorCodeMail($user->two_factor_code));
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to send email. Please try again.'); 
        }

        return back()->with('message', 'The two factor code has been resent.');
    }
}
