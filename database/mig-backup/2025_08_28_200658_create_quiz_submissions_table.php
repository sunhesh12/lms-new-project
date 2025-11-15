<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('portal_users')->onDelete('cascade'); // Assuming 'portal_users' is your users table
            $table->foreignId('quiz_id')->constrained()->onDelete('cascade');
            $table->text('submitted_answers'); // Store JSON of answers
            $table->integer('score')->nullable(); // Score for graded questions
            $table->decimal('percentage_score', 5, 2)->nullable();
            $table->boolean('is_passed')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_submissions');
    }
};