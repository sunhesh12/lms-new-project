<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FeedSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeedSettingsController extends Controller
{
    /**
     * Show the feed settings form
     */
    public function index()
    {
        $settings = FeedSetting::getInstance();
        
        return Inertia::render('Admin/FeedSettings', [
            'settings' => $settings
        ]);
    }

    /**
     * Update feed settings
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'max_video_size_mb' => 'required|integer|min:1|max:500',
            'max_photo_size_mb' => 'required|integer|min:1|max:100',
            'max_photos_per_post' => 'required|integer|min:1|max:20',
            'max_videos_per_post' => 'required|integer|min:1|max:5',
            'daily_post_limit' => 'required|integer|min:1|max:100',
            'daily_status_limit' => 'required|integer|min:1|max:50',
            'status_duration_minutes' => 'required|integer|min:1|max:10080', // max 1 week
        ]);

        $settings = FeedSetting::getInstance();
        $settings->update($validated);

        return back()->with('success', 'Feed settings updated successfully!');
    }
}
