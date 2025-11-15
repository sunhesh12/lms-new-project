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
        Schema::create('course_module', function (Blueprint $table) {
            $table->id(); // Primary Key
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade'); // Foreign Key 1
            $table->foreignId('module_id')->constrained('modules')->onDelete('cascade'); // Foreign Key 2
            $table->timestamps(); // Optional timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_module');
    }
};
