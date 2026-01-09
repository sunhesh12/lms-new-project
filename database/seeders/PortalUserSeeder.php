<?php

namespace Database\Seeders;

use App\Models\PortalUser;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PortalUserSeeder extends Seeder
{
    public function run()
    {
        $roles = ['student', 'lecturer', 'admin'];

        for ($i = 1; $i <= 10; $i++) {
            PortalUser::create([
                'id' => Str::uuid(),
                'full_name' => fake()->name(),
                'age' => rand(18, 35),
                'email' => fake()->unique()->safeEmail(),
                'mobile_no' => fake()->numerify('07########'),
                'address' => fake()->address(),
                'password' => Hash::make('password'), // Default password
                'role' => $roles[array_rand($roles)],
                'status' => 1,
                'course_id' => null, // Or set if you want to link to a course
                'profile_picture' => fake()->randomElement(['profile/student_m.png', 'profile/student_f.png', 'profile/lecturer_m.png', 'profile/lecturer_f.png'])
            ]);
        }
        // The student that we are going to test
        PortalUser::create([
            'id' => Str::uuid(),
            'full_name' => 'Rasuwan Kalhara',
            'age' => 21,
            'email' => 'kalharaweragala@gmail.com',
            'mobile_no' => '0705085269',
            'address' => fake()->address(),
            'password' => Hash::make('kalhara1234'), // Default password
            'role' => 'student',
            'status' => 1,
            'course_id' => 1, // Or set if you want to link to a course
            'profile_picture' => 'profile/student_m.png'
        ]);

        // The teacher that we are going to test
        // The student that we are going to test
        PortalUser::create([
            'id' => Str::uuid(),
            'full_name' => 'Kamal Perera',
            'age' => 40,
            'email' => 'kamalperera@gmail.com',
            'mobile_no' => '0765385261',
            'address' => fake()->address(),
            'password' => Hash::make('kamal1234'), // Default password
            'role' => 'lecturer',
            'status' => 1,
            'course_id' => null, // Or set if you want to link to a course
            'profile_picture' => 'profile/lecturer_m.png'
        ]);

        // This is the admin that we are going to test
        PortalUser::create([
            'id' => Str::uuid(),
            'full_name' => 'Sam Perera',
            'age' => 46,
            'email' => 'sam@gmail.com',
            'mobile_no' => '0783453451',
            'address' => fake()->address(),
            'password' => Hash::make('kamal1234'), // Default password
            'role' => 'admin',
            'status' => 1,
            'course_id' => null, // Or set if you want to link to a course
            'profile_picture' => 'profile/lecturer_m.png'
        ]);
    }
}
