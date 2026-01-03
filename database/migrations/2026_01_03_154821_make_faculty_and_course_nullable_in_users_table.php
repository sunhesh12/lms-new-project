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
            // Drop foreign key constraints first
            $table->dropForeign(['faculty_id']);
            $table->dropForeign(['course_id']);
            
            // Make columns nullable
            $table->uuid('faculty_id')->nullable()->change();
            $table->uuid('course_id')->nullable()->change();
            
            // Re-add foreign key constraints with nullable support
            $table->foreign('faculty_id')->references('id')->on('faculties')->onDelete('set null');
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop foreign key constraints
            $table->dropForeign(['faculty_id']);
            $table->dropForeign(['course_id']);
            
            // Make columns not nullable
            $table->uuid('faculty_id')->nullable(false)->change();
            $table->uuid('course_id')->nullable(false)->change();
            
            // Re-add foreign key constraints
            $table->foreign('faculty_id')->references('id')->on('faculties');
            $table->foreign('course_id')->references('id')->on('courses');
        });
    }
};
