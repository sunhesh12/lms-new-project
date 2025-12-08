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
        // All the submission are tracked in this mapping table
        // There can be many submissions per assignment
        Schema::create('submissions', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw("(UUID())"));
            $table->timestamps();
            $table->boolean("is_deleted")->default(false);
            $table->string('student_id');
            $table->string('assignment_id');
            $table->string("resource_id");
            $table->foreign("student_id")->references("id")->on("users");
            $table->foreign("assignment_id")->references("id")->on("assignments");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
