<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->query('q');
        $fromDate = $request->query('from_date');
        $fromTime = $request->query('from_time');
        $toDate = $request->query('to_date');
        $toTime = $request->query('to_time');

        $postsQuery = Post::with(['user', 'attachments'])->orderBy('created_at', 'desc');

        if ($query) {
            $postsQuery->where(function($q) use ($query) {
                $q->where('content', 'like', "%{$query}%")
                  ->orWhereHas('user', function($uq) use ($query) {
                      $uq->where('name', 'like', "%{$query}%")
                         ->orWhere('email', 'like', "%{$query}%");
                  });
            });
        }

        if ($fromDate) {
            $fromTime = $fromTime ?: '00:00';
            try {
                $from = \Carbon\Carbon::createFromFormat('Y-m-d H:i', "{$fromDate} {$fromTime}");
                $postsQuery->where('created_at', '>=', $from);
            } catch (\Exception $e) {
                // ignore
            }
        }

        if ($toDate) {
            $toTime = $toTime ?: '23:59';
            try {
                $to = \Carbon\Carbon::createFromFormat('Y-m-d H:i', "{$toDate} {$toTime}");
                $postsQuery->where('created_at', '<=', $to);
            } catch (\Exception $e) {
                // ignore
            }
        }

        $posts = $postsQuery->paginate(20)->appends($request->only(['q', 'from_date', 'from_time', 'to_date', 'to_time']));

        return Inertia::render('Admin/Posts', [
            'posts' => $posts,
            'filters' => $request->only(['q', 'from_date', 'from_time', 'to_date', 'to_time']),
        ]);
    }

    public function destroy(Post $post)
    {
        // Delete attachments files
        foreach ($post->attachments as $att) {
            if (!empty($att->file_path)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($att->file_path);
            }
            $att->delete();
        }

        $post->delete();

        return redirect()->back()->with('success', 'Post removed.');
    }
}
