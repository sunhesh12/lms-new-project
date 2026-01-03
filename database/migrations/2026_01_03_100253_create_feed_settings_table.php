<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('feed_settings', function (Blueprint $table) {
            $table->id();
            $table->integer('max_video_size_mb')->default(50);
            $table->integer('max_photo_size_mb')->default(10);
            $table->integer('max_photos_per_post')->default(10);
            $table->integer('max_videos_per_post')->default(1);
            $table->integer('daily_post_limit')->default(20);
            $table->integer('daily_status_limit')->default(10);
            $table->integer('status_duration_minutes')->default(1); // 1 minute for testing
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feed_settings');
    }
};
