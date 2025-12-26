<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class StudentsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Get all course UUIDs from the courses table
        $userIds = DB::table('users')->pluck('id')->toArray();

        $students = [];

        // assuming your users table already has 10 users (IDs 1–10)
        for ($i = 1; $i <= 5; $i++) {
            $students[] = [
                'academic_year' => $faker->randomElement(['2022/2023', '2023/2024', '2024/2025']),
                'user_id' => $faker->randomElement($userIds),     // connect each student to a user
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('students')->insert($students);
    }
}
