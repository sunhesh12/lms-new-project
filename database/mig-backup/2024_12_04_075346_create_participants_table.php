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
        Schema::create('participants', function (Blueprint $table) {
            $table->id(); // Primary Key
            $table->foreignId('user_id')->constrained('portal_users')->onDelete('cascade'); // Links to PortalUser
            $table->foreignId('activity_id')->constrained('activities')->onDelete('cascade'); // Links to Activity
            $table->text('submission')->nullable(); // Submission content
            $table->integer('marks')->nullable(); // Marks awarded
            $table->boolean('is_done')->default(false); // Indicates if the submission is completed
            $table->timestamps(); // Created_at and Updated_at
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participants');
    }
};
