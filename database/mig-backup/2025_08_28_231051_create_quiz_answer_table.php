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
        Schema::create('quizanswers', function (Blueprint $table) {
            $table->id();
            // This line defines the 'quizquestion_id' column and sets up the foreign key
            // It automatically constrains to the 'id' column of the 'quizquestions' table.
            $table->foreignId('quizquestion_id')->constrained('quizquestions')->onDelete('cascade');
            $table->text('answer_text');
            $table->boolean('is_correct')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quizanswers');
    }
};
