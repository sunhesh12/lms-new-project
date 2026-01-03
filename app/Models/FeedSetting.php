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
    ];

    /**
     * Get or create the singleton settings instance
     */
    public static function getInstance()
    {
        $settings = self::first();
        
        if (!$settings) {
            $settings = self::create([]);
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
