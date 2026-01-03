<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class ReactionController extends Controller
{
    public function toggle(Request $request, Post $post)
    {
        $reaction = $post->reactions()->where('user_id', auth()->id())->first();

        if ($reaction) {
            $reaction->delete();
        } else {
            $post->reactions()->create([
                'user_id' => auth()->id(),
                'type' => 'like', // Default to like for MVP
            ]);
        }

        return back();
    }
}
