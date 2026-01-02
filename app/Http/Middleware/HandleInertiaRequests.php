<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                    'address' => $request->user()->address,
                    'user_phone_no' => $request->user()->user_phone_no,
                    'user_dob' => $request->user()->user_dob,
                    'profile_pic' => $request->user()->profile_pic,
                    'avatar_url' => $request->user()->avatar_url,
                    'unreadNotificationsCount' => $request->user()->unreadNotifications()->count(),
                    'unreadChatCount' => $request->user()->unreadChatCount(),
                ] : null,
            ],
        ];
    }
}
