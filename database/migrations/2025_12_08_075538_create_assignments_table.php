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
        Schema::create('assignments', function (Blueprint $table) {
            $table->uuid("id")->primary()->default(DB::raw("(UUID())"));
            $table->timestamps();
            $table->string("title")->nullable();
            $table->string("description")->nullable();
            $table->boolean("is_deleted")->default(false);
            $table->timestamp("started")->nullable();
            $table->timestamp("deadline")->nullable();
            $table->string("resource_id")->nullable();
            $table->string("module_id");
            $table->foreign("module_id")->references("id")->on("modules")->onDelete("cascade");
            $table->foreign("resource_id")->references("id")->on("resources")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assignments');
    }
};
