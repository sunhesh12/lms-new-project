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

        $users = [];
        for ($i = 0; $i < 10; $i++) {

            $users[] = [
                'name'            => $faker->name(),
                'email'           => $faker->unique()->safeEmail(),
                'user_Phone_No'   => $faker->numerify('07########'), // SL-style phone number
                'profile_pic'     => 'profile/default.png',
                'user_dob'        => $faker->date('Y-m-d'),
                'address'         => $faker->address(),
                'status'          => $i % 2 == 0 ? 'blocked' : 'active',
                'faculty_id'      => rand(1, 4),   // Assuming faculties table has IDs 1–4
                'password'        => Hash::make('password123'),
                'created_at'      => now(),
                'updated_at'      => now(),
            ];
        }

        DB::table('users')->insert($users);
    }
}
