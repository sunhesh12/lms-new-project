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
        Schema::create('topics', function (Blueprint $table) {
            $table->id(); // Primary Key
            $table->foreignId('module_id')->constrained('modules')->onDelete('cascade'); // Foreign Key to Modules
            $table->string('title'); // Title of the topic
            $table->text('description')->nullable(); // Description of the topic
            $table->string('type')->nullable(); // Lecture, Assignment, Quiz, etc.
            $table->boolean('is_visible')->default(true); // Visibility status
            $table->boolean('is_complete')->default(false); // Completion status
            $table->timestamps(); // Created_at and Updated_at
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('topics');
    }
};
