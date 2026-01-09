<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request)
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof \Illuminate\Contracts\Auth\MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . Auth::id(),
            'address' => 'nullable|string|max:255',
            'user_phone_no' => 'nullable|string|max:20',
            'user_dob' => 'nullable|string|max:20',
        ]);

        $request->user()->fill($request->all());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return redirect()->route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->to('/');
    }

    public function updatePicture(Request $request)
    {
        $request->validate([
            'profile_pic' => 'required|image|max:2048', // 2MB max
        ]);

        $user = Auth::user();

        // Delete old picture if exists
        if ($user->profile_pic && !str_contains($user->profile_pic, 'default.png')) {
            Storage::disk('public')->delete($user->profile_pic);
        }

        // Store new picture
        $path = $request->file('profile_pic')->store('profile_pics', 'public');

        $user->update([
            'profile_pic' => $path
        ]);

        return back()->with('success', 'Profile picture updated successfully!');
    }
}
