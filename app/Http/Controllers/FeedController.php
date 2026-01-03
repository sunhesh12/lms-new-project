<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostAttachment;
use App\Models\Status;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FeedController extends Controller
{
    public function index()
    {
        $posts = Post::with([
            'user', 
            'attachments', 
            'reactions', 
            'comments.user', 
            'comments.replies.user',
            'parent.user',
            'parent.attachments'
        ])
        ->withCount(['reactions', 'comments'])
        ->latest()
        ->paginate(10);

        // Add 'liked_by_auth_user' attribute manually or via map
        $posts->getCollection()->transform(function ($post) {
            $post->is_liked = $post->isLikedBy(auth()->user());
            return $post;
        });

        // Get active statuses grouped by user
        $statuses = Status::active()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('user_id')
            ->map(function ($userStatuses) {
                return [
                    'user' => $userStatuses->first()->user,
                    'statuses' => $userStatuses->values(),
                    'unviewed_count' => $userStatuses->filter(function ($status) {
                        return !$status->isViewedBy(auth()->id());
                    })->count(),
                ];
            })
            ->values();

        return Inertia::render('Feed/Index', [
            'posts' => $posts,
            'statuses' => $statuses,
        ]);
    }

    public function store(Request $request)
    {
        // Prevent users who are blocked from uploading to feed
        if (!auth()->user()->canUploadFeed()) {
            return back()->withErrors(['blocked' => 'Your account is blocked from uploading to the feed.']);
        }

        $settings = \App\Models\FeedSetting::getInstance();

        $validated = $request->validate([
            'content' => 'nullable|string|max:1000',
            'file' => 'nullable|file',
        ]);

        if (empty($validated['content']) && !$request->hasFile('file')) {
            return back()->with('error', 'Post cannot be empty.');
        }

        $type = 'text';
        if ($request->hasFile('file')) {
            $mime = $request->file('file')->getMimeType();
            if (str_starts_with($mime, 'image/')) {
                $type = 'image';
            } elseif (str_starts_with($mime, 'video/')) {
                $type = 'video';
            }
        }

        $post = Post::create([
            'user_id' => auth()->id(),
            'content' => $validated['content'],
            'type' => $type,
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $mime = $file->getMimeType();
            $isVideo = str_starts_with($mime, 'video');

            $maxSizeMb = $isVideo ? ($settings->max_video_size_mb ?? 50) : ($settings->max_photo_size_mb ?? 5);
            if ($file->getSize() > $maxSizeMb * 1024 * 1024) {
                return back()->withErrors(['file' => "File size exceeds {$maxSizeMb}MB limit"]);
            }

            $path = $file->store('uploads/posts', 'public');

            PostAttachment::create([
                'post_id' => $post->id,
                'file_path' => $path,
                'file_type' => $type,
            ]);
        }

        return redirect()->back()->with('success', 'Post created successfully!');
    }

    public function destroy(Post $post)
    {
        if ($post->user_id !== auth()->id() && !auth()->user()->isAdmin()) { // Assuming isAdmin exists or similar
             abort(403);
        }

        $post->delete();
        return redirect()->back()->with('success', 'Post deleted.');
    }

    public function share(Request $request, Post $post)
    {
        $validated = $request->validate([
            'content' => 'nullable|string|max:500',
        ]);

        Post::create([
            'user_id' => auth()->id(),
            'content' => $validated['content'],
            'type' => 'shared',
            'parent_id' => $post->id,
        ]);

        return redirect()->back()->with('success', 'Post shared!');
    }
}
