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

        $posts = $postsQuery->get()
            ->filter(function ($post) use ($query) {
                if (empty($query))
                    return true;
                $user = $post->user;
                return stripos($post->content, $query) !== false ||
                    ($user && (stripos($user->name, $query) !== false || stripos($user->email, $query) !== false));
            });

        $total = $posts->count();
        $page = $request->query('page', 1);
        $perPage = 20;
        $posts = new \Illuminate\Pagination\LengthAwarePaginator(
            $posts->forPage($page, $perPage)->values(),
            $total,
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

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
