<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\SystemAdmin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $facultyId = \App\Models\Faculty::first()->id;
        $courseId = \App\Models\Course::first()->id;

        $admins = [
            [
                'id' => (string) Str::uuid(),
                'name' => 'Main Admin',
                'email' => 'admin@lms.com',
                'password' => Hash::make('admin123'),
                'user_phone_no' => '0712345678',
                'profile_pic' => 'profile/default.png',
                'user_dob' => '1990-01-01',
                'address' => 'LMS Headquarters',
                'status' => 'active',
                'faculty_id' => $facultyId,
                'course_id' => $courseId,
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Support Admin',
                'email' => 'support@lms.com',
                'password' => Hash::make('support123'),
                'user_phone_no' => '0777654321',
                'profile_pic' => 'profile/default.png',
                'user_dob' => '1995-05-05',
                'address' => 'Support Office',
                'status' => 'active',
                'faculty_id' => $facultyId,
                'course_id' => $courseId,
            ],
        ];

        foreach ($admins as $adminData) {
            $user = User::where('email', $adminData['email'])->first();
            
            if (!$user) {
                $user = User::create($adminData);
            }

            // Ensure system_admin record exists
            $adminRecord = SystemAdmin::where('user_id', $user->id)->first();
            if (!$adminRecord) {
                SystemAdmin::create([
                    'user_id' => $user->id,
                    'type' => 'super_admin',
                ]);
            }
        }
    }
}
