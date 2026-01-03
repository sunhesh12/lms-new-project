<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FeedSetting;

class FeedSettingsSeeder extends Seeder
{
    public function run()
    {
        FeedSetting::create([
            'max_video_size_mb' => 50,
            'max_photo_size_mb' => 10,
            'max_photos_per_post' => 10,
            'max_videos_per_post' => 1,
            'daily_post_limit' => 20,
            'daily_status_limit' => 10,
            // default status duration: 1 day (1440 minutes)
            'status_duration_minutes' => 1440,
        ]);
    }
}
