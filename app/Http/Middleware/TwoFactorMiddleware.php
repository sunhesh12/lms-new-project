<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TwoFactorMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        if (auth()->check() && $user->two_factor_code) {
            
             // If user has a code but session not verified
             if (!session('2fa_verified')) {
                 
                 // Allow access to verification routes and logout
                 if ($request->is('verify-2fa*') || $request->is('logout')) {
                     return $next($request);
                 }
                 
                 return redirect()->route('two-factor.index');
             }
        }

        return $next($request);
    }
}
