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
        Schema::create('lecture_materials', function (Blueprint $table) {
            $table->id(); // Primary Key
            $table->foreignId('topic_id')->constrained('topics')->onDelete('cascade'); // Links to Topics
            $table->string('material_type'); // Type of material (e.g., document, video, link)
            $table->string('material_title'); // Title of the material
            $table->string('material_url')->nullable(); // URL or file path for the material
            $table->timestamps(); // Created_at and Updated_at
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lecture_materials');
    }
};
