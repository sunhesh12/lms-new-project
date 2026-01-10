<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class UpdateLastSeen
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();
            // Cache the online status for 60 seconds to reduce DB queries
            $cacheKey = 'user-online-' . $user->id;
            
            if (!Cache::has($cacheKey)) {
                $user->update(['last_seen_at' => now()]);
                Cache::put($cacheKey, true, 60);
            }
        }

        return $next($request);
    }
}
