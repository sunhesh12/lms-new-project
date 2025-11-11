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
        Schema::create('quizquestions', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('quiz_id')->constrained()->onDelete('cascade'); // Link to Quiz
            $table->text('question_text'); // ✨ Ensure this column is present
            $table->string('question_type')->default('single_choice'); // e.g., 'single_choice', 'multiple_choice', 'writing'
            $table->string('image_url')->nullable(); // New column for image path
            $table->integer('points')->default(1); // Points for this question
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quizquestions');
    }
};
