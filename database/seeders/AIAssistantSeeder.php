<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Faculty;
use App\Models\Course;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AIAssistantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fixed UUID for the AI Assistant
        $aiUuid = '00000000-0000-0000-0000-000000000000';

        // 1. Ensure a Faculty exists
        $faculty = Faculty::first();
        if (!$faculty) {
            $faculty = Faculty::create([
                'id' => Str::uuid(),
                'name' => 'System Faculty',
                'description' => 'Default faculty for system accounts',
            ]);
        }

        // 2. Ensure a Course exists
        $course = Course::first();
        if (!$course) {
            $course = Course::create([
                'id' => Str::uuid(),
                'title' => 'System Foundation',
                'description' => 'Default course for system accounts',
                'faculty_id' => $faculty->id,
            ]);
        }

        // 3. Create the AI User
        if (!User::where('id', $aiUuid)->exists()) {
            User::create([
                'id' => $aiUuid,
                'name' => 'Academic AI Assistant',
                'email' => 'ai.assistant@lms.system',
                'password' => Hash::make(Str::random(32)),
                'status' => 'active',
                'profile_pic' => 'profile/ai-bot.png',
                'user_phone_no' => '0000000000',
                'user_dob' => '2000-01-01',
                'address' => 'System Core',
                'faculty_id' => $faculty->id,
                'course_id' => $course->id,
            ]);
        }
    }
}
