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
        Schema::table('feed_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('feed_settings', 'photo_status_duration_minutes')) {
                $table->integer('photo_status_duration_minutes')->nullable()->after('status_duration_minutes');
            }
            if (!Schema::hasColumn('feed_settings', 'video_status_duration_minutes')) {
                $table->integer('video_status_duration_minutes')->nullable()->after('photo_status_duration_minutes');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('feed_settings', function (Blueprint $table) {
            if (Schema::hasColumn('feed_settings', 'video_status_duration_minutes')) {
                $table->dropColumn('video_status_duration_minutes');
            }
            if (Schema::hasColumn('feed_settings', 'photo_status_duration_minutes')) {
                $table->dropColumn('photo_status_duration_minutes');
            }
        });
    }
};
