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
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();// Primary Key
            $table->foreignId('module_id')->constrained('modules')->onDelete('cascade'); // Foreign Key to Modules
            $table->string('topic'); // Announcement topic
            $table->text('description'); // Announcement details
            $table->timestamps(); // Includes created_at and updated_at
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcments');
    }
};
