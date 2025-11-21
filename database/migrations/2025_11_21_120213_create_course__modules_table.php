<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_modules', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('(UUID())'));

            // Define foreign key columns first
            $table->uuid('course_id');
            $table->uuid('module_id');
            $table->uuid('faculty_id');

            // Extra fields
            $table->string('semester')->nullable();
            $table->integer('year')->nullable();
            $table->boolean('is_optional')->default(false);

            $table->timestamps();

            // Add foreign key constraints
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
            $table->foreign('module_id')->references('id')->on('modules')->onDelete('cascade');
            $table->foreign('faculty_id')->references('id')->on('faculties')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_modules');
    }
};
