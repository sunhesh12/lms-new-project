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
        // Schema::table('portal_users', function (Blueprint $table) {
        //     $table->renameColumn('Full_name', 'full_name');
        //     $table->renameColumn('Age', 'age');
        //     $table->renameColumn('Email', 'email');
        //     $table->renameColumn('Mobile_No', 'mobile_no');
        //     $table->renameColumn('Address', 'address');
        //     $table->renameColumn('Profile_Picture', 'profile_picture');
        //     $table->renameColumn('Password', 'password');
        //     $table->renameColumn('Role', 'role');
        //     $table->renameColumn('Status', 'status');
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
