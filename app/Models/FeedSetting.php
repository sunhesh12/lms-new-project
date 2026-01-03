<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeedSetting extends Model
{
    protected $fillable = [
        'max_video_size_mb',
        'max_photo_size_mb',
        'max_photos_per_post',
        'max_videos_per_post',
        'daily_post_limit',
        'daily_status_limit',
        'status_duration_minutes',
        'photo_status_duration_minutes',
        'video_status_duration_minutes',
    ];

    /**
     * Get or create the singleton settings instance
     */
    public static function getInstance()
    {
        $settings = self::first();
        
        if (!$settings) {
            // Create with sensible defaults
            $settings = self::create([
                'max_video_size_mb' => 50,
                'max_photo_size_mb' => 10,
                'max_photos_per_post' => 5,
                'max_videos_per_post' => 1,
                'daily_post_limit' => 20,
                'daily_status_limit' => 10,
                'status_duration_minutes' => 1440, // 1 day
                'photo_status_duration_minutes' => 1440,
                'video_status_duration_minutes' => 1440,
            ]);
        }
        
        return $settings;
    }

    /**
     * Get a specific setting value
     */
    public static function getSetting($key)
    {
        return self::getInstance()->$key;
    }

    /**
     * Update a specific setting
     */
    public static function updateSetting($key, $value)
    {
        $settings = self::getInstance();
        $settings->$key = $value;
        $settings->save();
        
        return $settings;
    }

    /**
     * Get all settings as array
     */
    public static function getAll()
    {
        return self::getInstance()->toArray();
    }
}
