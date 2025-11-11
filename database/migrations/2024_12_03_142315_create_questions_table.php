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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained('activities')->onDelete('cascade'); // Foreign key to quizzes (activities table)
            $table->integer('question_number'); // Question number
            $table->text('question'); // The question text
            $table->enum('question_type', ['single_answer', 'multiple_choice']); // Question type: single_answer or multiple_choice
            $table->text('answer')->nullable(); // Correct answer (only for single-answer questions)
            $table->json('options')->nullable(); // Multiple choices options (only for multiple-choice questions)
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
