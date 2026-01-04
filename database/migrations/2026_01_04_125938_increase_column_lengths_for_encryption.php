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
        Schema::table('users', function (Blueprint $table) {
            $table->text('name')->nullable()->change();
            $table->text('email')->nullable()->change();
            $table->text('user_phone_no')->nullable()->change();
            $table->text('user_dob')->nullable()->change();
            $table->text('address')->nullable()->change();
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->text('content')->nullable()->change();
        });

        Schema::table('posts', function (Blueprint $table) {
            $table->text('content')->nullable()->change();
        });

        Schema::table('statuses', function (Blueprint $table) {
            $table->text('content')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->nullable()->change();
            $table->string('email')->nullable()->change();
            $table->string('user_phone_no')->nullable()->change();
            $table->string('user_dob')->nullable()->change();
            $table->string('address')->nullable()->change();
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->string('content', 255)->nullable()->change();
        });

        Schema::table('posts', function (Blueprint $table) {
            $table->string('content', 255)->nullable()->change();
        });

        Schema::table('statuses', function (Blueprint $table) {
            $table->string('content', 255)->nullable()->change();
        });
    }
};
