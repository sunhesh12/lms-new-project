<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained()->onDelete('cascade');
            $table->uuid('user_id'); // Changed to UUID
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->json('answers'); // User's answers
            $table->integer('score'); // Total score achieved
            $table->decimal('percentage', 5, 2); // Percentage score
            $table->boolean('passed')->default(false);
            $table->timestamp('started_at');
            $table->timestamp('completed_at')->nullable();
            $table->integer('time_taken')->nullable(); // in seconds
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_attempts');
    }
};