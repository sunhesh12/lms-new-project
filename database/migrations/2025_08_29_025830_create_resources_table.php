<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('lecture_materials', function (Blueprint $table) {
            $table->string('file_path')->nullable();   // for uploaded files
            $table->bigInteger('file_size')->nullable();
            $table->string('mime_type')->nullable();
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lecture_materials', function (Blueprint $table) {
            $table->dropForeign(['topic_id']);
            $table->dropColumn(['topic_id', 'file_path', 'file_size', 'mime_type']);
        });
    }
};
