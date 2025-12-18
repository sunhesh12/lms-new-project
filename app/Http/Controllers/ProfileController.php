<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function updatePicture(Request $request)
    {
        $request->validate([
            'profile_pic' => 'required|image|max:2048', // 2MB max
        ]);

        $user = Auth::user();

        // Delete old picture if exists
        if ($user->profile_pic) {
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
