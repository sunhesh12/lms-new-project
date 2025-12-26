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
        Schema::table('quizzes', function (Blueprint $table) {
            $table->boolean('allow_multiple_attempts')->default(true)->after('is_active');
            $table->integer('max_attempts')->default(0)->after('allow_multiple_attempts'); // 0 for unlimited
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quizzes', function (Blueprint $table) {
            $table->dropColumn(['allow_multiple_attempts', 'max_attempts']);
        });
    }
};
