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
        Schema::table('users', function (Blueprint $table) {
                        $table->foreignUuId('course_id')
                  ->constrained('courses')
                  ->after('id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user', function (Blueprint $table) {
                        // Drop foreign key first
            $table->dropForeign(['course_id']);

            // Drop the column
            $table->dropColumn('course_id');
        });
    }
};
