<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('can_upload_feed')->default(true)->after('status');
            $table->timestamp('upload_blocked_until')->nullable()->after('can_upload_feed');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['can_upload_feed', 'upload_blocked_until']);
        });
    }
};
