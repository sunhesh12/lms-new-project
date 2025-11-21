<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FacultySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('faculties')->insert([
            [
                'id' => Str::uuid(),
                'fac_name' => 'Faculty of Engineering',
                'theme'    => 'blue',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'fac_name' => 'Faculty of Management Studies',
                'theme'    => 'green',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'fac_name' => 'Faculty of Applied Sciences',
                'theme'    => 'orange',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'fac_name' => 'Faculty of Humanities and Social Sciences',
                'theme'    => 'purple',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
