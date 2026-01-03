<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            FacultySeeder::class,
            CourseSeeder::class,
            UsersTableSeeder::class,
            StudentsTableSeeder::class,
            LecturersTableSeeder::class,
            AdminUserSeeder::class,      // Added AdminUserSeeder
            ModuleSeeder::class,
            TopicSeeder::class,
            ResourceSeeder::class,
            ChatSeeder::class,
            EventSeeder::class,
            QuizSeeder::class,
            StatusSeeder::class,
        ]);
    }
}
