<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class LecturersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        $lectures = [];

        for ($i = 0; $i < 10; $i++) {
            $lectures[] = [
                'academic_level' => $faker->randomElement(['Undergraduate', 'Postgraduate', 'Diploma']),
                'research_area'  => $faker->words(3, true),
                'lecture_type'   => $faker->randomElement(['Full-time', 'Part-time']),
                'user_id'        => rand(1, 10),  // assuming you have 10 users
                'created_at'     => now(),
                'updated_at'     => now(),
            ];
        }

        DB::table('lectures')->insert($lectures);
    }
}
