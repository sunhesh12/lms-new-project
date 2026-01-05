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
        Schema::create('module_staff', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuId('module_id')->constrained('modules')->onDelete('cascade');
            $table->foreignUuId('lecture_id')->constrained('lectures')->onDelete('cascade');
            $table->string('role')->default('lecturer'); // e.g., 'lecturer', 'assistant'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('module_staff');
    }
};
