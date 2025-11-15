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
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('topic_id')->constrained()->onDelete('cascade'); // Link to the existing Topic table
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type')->default('quiz'); // ✨ Added 'type' column with a default value 'quiz'
            $table->timestamp('deadline')->nullable(); // Optional: quiz deadline
            $table->integer('duration_minutes')->nullable(); // Optional: quiz duration
            $table->decimal('pass_percentage', 5, 2)->default(0.00); // Pass percentage for the quiz
            $table->boolean('is_published')->default(false); // Whether the quiz is visible to students
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};
