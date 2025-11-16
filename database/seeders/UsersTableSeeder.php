<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
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
            $name = $faker->name();
            $email = $faker->unique()->safeEmail();
            $users[] = [
                'name' => $name,
                'email' => $email,
                'user_Phone_No' => $faker->phoneNumber(),
                // you can use faker->imageUrl() or set a default placeholder
                'profile_pic' => 'profile/default.png',
                // store dob as Y-m-d (string column in your migration)
                'user_dob' => $faker->date('Y-m-d'),
                'address' => $faker->address(),
                // use a known password for all seeded users (hashed)
                'password' => Hash::make('password123'),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('users')->insert($users);
    }
}
