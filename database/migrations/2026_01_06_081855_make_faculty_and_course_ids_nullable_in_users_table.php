<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignUuId('faculty_id')->nullable()->change();
            $table->foreignUuId('course_id')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignUuId('faculty_id')->nullable(false)->change();
            $table->foreignUuId('course_id')->nullable(false)->change();
        });
    }
};
