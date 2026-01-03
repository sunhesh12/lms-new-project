<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AiPreferenceController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'ai_provider' => 'nullable|string',
        ]);

        $user = Auth::user();
        $user->ai_provider = $data['ai_provider'] ?? null;
        $user->save();

        return response()->json(['ok' => true, 'ai_provider' => $user->ai_provider]);
    }
}
