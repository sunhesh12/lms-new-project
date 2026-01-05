<?php

namespace Database\Seeders;

use App\Models\Faculty;
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
        $faculties = [
            [
                'fac_name' => 'Faculty of Engineering',
                'theme' => 'blue',
            ],
            [
                'fac_name' => 'Faculty of Management Studies',
                'theme' => 'green',
            ],
            [
                'fac_name' => 'Faculty of Applied Sciences',
                'theme' => 'orange',
            ],
            [
                'fac_name' => 'Faculty of Humanities and Social Sciences',
                'theme' => 'purple',
            ],
        ];

        foreach ($faculties as $faculty) {
            Faculty::create($faculty);
        }
    }
}
