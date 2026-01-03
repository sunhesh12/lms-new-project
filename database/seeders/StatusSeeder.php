<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Status;
use App\Models\User;
use Carbon\Carbon;

class StatusSeeder extends Seeder
{
    public function run()
    {
        $users = User::limit(6)->get();

        foreach ($users as $user) {
            Status::create([
                'user_id' => $user->id,
                'content' => 'Hello from ' . $user->name . '! This is a sample status.',
                'media_path' => null,
                'media_type' => null,
                'expires_at' => Carbon::now()->addHours(24),
                'views_count' => 0,
            ]);
        }
    }
}
