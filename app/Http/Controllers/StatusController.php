<?php

namespace App\Http\Controllers;

use App\Models\Status;
use App\Models\FeedSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Inertia\Inertia;

class StatusController extends Controller
{
    /**
     * Get all active statuses grouped by user
     */
    public function index()
    {
        $statuses = Status::active()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('user_id')
            ->map(function ($userStatuses) {
                return [
                    'user' => $userStatuses->first()->user,
                    'statuses' => $userStatuses,
                    'unviewed_count' => $userStatuses->filter(function ($status) {
                        return !$status->isViewedBy(auth()->id());
                    })->count(),
                ];
            })
            ->values();

        return response()->json($statuses);
    }

    /**
     * Store a new status
     */
    public function store(Request $request)
    {
        // Prevent users who are blocked from uploading to statuses
        if (!auth()->user()->canUploadFeed()) {
            return back()->withErrors(['blocked' => 'Your account is blocked from uploading statuses.']);
        }

        $settings = FeedSetting::getInstance();
        
        // Check daily limit
        $todayCount = Status::where('user_id', auth()->id())
            ->whereDate('created_at', Carbon::today()->toDateString())
            ->count();
            
        if ($todayCount >= $settings->daily_status_limit) {
            return back()->withErrors([
                'limit' => "You've reached your daily status limit ({$settings->daily_status_limit})"
            ]);
        }

        // Validate content and file type only; file size is checked per-type below
        $request->validate([
            'content' => 'nullable|string|max:500',
            'media' => 'nullable|file|mimes:jpg,jpeg,png,mp4,mov',
        ]);

        $mediaPath = null;
        $mediaType = null;

        if ($request->hasFile('media')) {
            $file = $request->file('media');
            $mediaType = str_starts_with($file->getMimeType(), 'video') ? 'video' : 'image';
            
            // Validate size based on type
            $maxSize = $mediaType === 'video' 
                ? $settings->max_video_size_mb 
                : $settings->max_photo_size_mb;
                
            if ($file->getSize() > $maxSize * 1024 * 1024) {
                return back()->withErrors([
                    'media' => "File size exceeds {$maxSize}MB limit"
                ]);
            }

            try {
                $mediaPath = $file->store('statuses', 'public');
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Status media store failed: ' . $e->getMessage());
                return back()->withErrors(['media' => 'Failed to store media file.']);
            }
        }

        // Determine expiration based on media type if specific durations provided
        $defaultDuration = $settings->status_duration_minutes ?? 1440; // default 1 day
        if ($mediaType === 'video' && !empty($settings->video_status_duration_minutes)) {
            $duration = $settings->video_status_duration_minutes;
        } elseif ($mediaType === 'image' && !empty($settings->photo_status_duration_minutes)) {
            $duration = $settings->photo_status_duration_minutes;
        } else {
            $duration = $defaultDuration;
        }

        $expiresAt = Carbon::now()->addMinutes((int)$duration);

        $status = Status::create([
            'user_id' => auth()->id(),
            'content' => $request->content,
            'media_path' => $mediaPath,
            'media_type' => $mediaType,
            'expires_at' => $expiresAt,
        ]);

        return back()->with('success', 'Status created successfully!');
    }

    /**
     * View a specific status
     */
    public function show(Status $status)
    {
        if ($status->is_expired) {
            abort(404, 'Status has expired');
        }

        // Record view if not own status
        if ($status->user_id !== auth()->id()) {
            $status->recordView(auth()->id());
        }

        $status->load('user', 'views.user');

        return response()->json($status);
    }

    /**
     * Delete own status
     */
    public function destroy(Status $status)
    {
        if ($status->user_id !== auth()->id() && auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }

        // Delete media file if exists
        if ($status->media_path) {
            Storage::disk('public')->delete($status->media_path);
        }

        $status->delete();

        return back()->with('success', 'Status deleted successfully!');
    }
}
