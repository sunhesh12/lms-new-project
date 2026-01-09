<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Get all course UUIDs from the courses table
        $courseIds = DB::table('courses')->pluck('id')->toArray();

        // Get all course UUIDs from the courses table
        $facultysIds = DB::table('faculties')->pluck('id')->toArray();


        $users = [];
        for ($i = 0; $i < 10; $i++) {

            $users[] = [
                'name' => $faker->name(),
                'email' => $faker->unique()->safeEmail(),
                'user_phone_no' => $faker->numerify('07########'), // SL-style phone number
                'profile_pic' => null,
                'user_dob' => $faker->date('Y-m-d'),
                'address' => $faker->address(),
                'status' => $i % 2 == 0 ? 'blocked' : 'active',
                'faculty_id' => $faker->randomElement($facultysIds),   // Assuming faculties table has IDs 1–4
                'password' => Hash::make('password123'),
                'created_at' => now(),
                'updated_at' => now(),
                'course_id' => $faker->randomElement($courseIds), // Assuming courses table has IDs 1–3
            ];
        }

        DB::table('users')->insert($users);

        // Check if test user exists
        $testUserEmail = 'abc@gmail.com';
        $existingUser = DB::table('users')->where('email', $testUserEmail)->first();

        if (!$existingUser) {
            DB::table('users')->insert([
                'name' => 'Test User',
                'email' => $testUserEmail,
                'user_phone_no' => $faker->numerify('0705085269'), // SL-style phone number
                'profile_pic' => null,
                'user_dob' => $faker->date('Y-m-d'),
                'address' => $faker->address(),
                'status' => 'active',
                'faculty_id' => $faker->randomElement($facultysIds),   // Assuming faculties table has IDs 1–4
                'password' => Hash::make('password123'),
                'created_at' => now(),
                'updated_at' => now(),
                'course_id' => $faker->randomElement($courseIds),
            ]);
        }

    }
}
