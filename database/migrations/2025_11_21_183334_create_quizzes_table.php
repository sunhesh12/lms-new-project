<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('(UUID())'));

            // Foreign Key
            $table->uuid('topic_id')->index();

            $table->string('heading');
            $table->string('description');
            $table->dateTimeTz('start_time');
            $table->dateTimeTz('end_time');

            // Duration in minutes (better than datetime)
            $table->integer('duration_minutes');

            $table->boolean('is_deleted')->default(false);

            // Foreign key constraints
            $table->foreign('topic_id')
                  ->references('id')
                  ->on('topics')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};
