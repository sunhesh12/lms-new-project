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
        // Departments Table
        Schema::create('departments', function (Blueprint $table) {
            $table->id(); // Primary Key
            $table->string('department_name'); // Department Name
            $table->string('department_head'); // Head of the Department
            $table->integer('maximum_students'); // Maximum allowed students in the department
            $table->timestamps(); // Created at and Updated at timestamps
        });

        // Password Reset Tokens Table
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // Sessions Table
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        // Courses Table
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('course_name');
            $table->integer('credit_value')->nullable();
            $table->integer('maximum_students')->nullable();
            $table->foreignId('department_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        // Portal Users Table
        Schema::create('portal_users', function (Blueprint $table) {
            $table->id(); // Auto-increment primary key
            $table->string('full_name'); // Full name
            $table->unsignedTinyInteger('Age')->nullable(); // Age (unsigned, optional)
            $table->string('email')->unique(); // Email (unique and required)
            $table->string('mobile_no', 15)->unique()->nullable(); // Mobile number (optional and unique)
            $table->text('address')->nullable(); // Address (optional)
            $table->string('institution')->nullable(); // Institution name (optional)
            $table->string('profile_picture')->nullable(); // Profile picture URL
            $table->string('password'); // Password (hashed)
            $table->string('role'); // User role (e.g., admin, student, etc.)
            $table->boolean('status')->default(1); // Status (active by default)
            $table->foreignId('course_id')->nullable()->constrained('courses')->onDelete('set null'); // Foreign key
            $table->timestamps(); // Created at and updated at fields
        });

        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->string('module_name');
            $table->integer('credit_value')->nullable();
            $table->integer('practical_exam_count')->nullable();
            $table->integer('writing_exam_count')->nullable();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->string('activity_name');
            $table->string('type'); // "assignment" or "quiz"
            $table->date('start_date')->nullable(); // Date when the activity starts
            $table->time('start_time')->nullable(); // Time when the activity starts
            $table->date('end_date')->nullable(); // Date when the activity ends
            $table->time('end_time')->nullable(); // Time when the activity ends
            $table->text('instructions')->nullable(); // For assignments
            $table->integer('question_count')->nullable(); // For quizzes
            $table->foreignId('module_id')->constrained('modules')->onDelete('cascade'); // Foreign key to modules
            $table->timestamps(); // Adds created_at and updated_at columns
        });

        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->nullable()->constrained('activities')->onDelete('cascade');
            $table->string('event_name');
            $table->date('start_date');
            $table->time('start_time')->nullable();
            $table->date('end_date')->nullable();
            $table->time('end_time')->nullable();
            $table->string('status')->default('scheduled');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
        Schema::dropIfExists('portal_users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('departments');
    }
};
