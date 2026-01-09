<?php

namespace Database\Seeders;

use App\Models\lecture;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use Illuminate\Support\Str;

class LecturersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Get all user UUIDs from the user table
        $userIds = DB::table('users')->pluck('id')->toArray();

        $lectures = [];

        for ($i = 6; $i <= 10; $i++) {
            $lectures[] = [
                'id' => Str::uuid(),
                'academic_level' => $faker->randomElement(['Undergraduate', 'Postgraduate', 'Diploma']),
                'research_area' => $faker->words(3, true),
                'lecture_type' => $faker->randomElement(['Full-time', 'Part-time']),
                'user_id' => $faker->randomElement($userIds),  // assuming you have 10 users
            ];
        }

        foreach ($lectures as $lectureData) {
            lecture::create($lectureData);
        }
    }
}
