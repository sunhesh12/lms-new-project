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
            ModuleSeeder::class,
            TopicSeeder::class,
            ResourceSeeder::class,
            // CourseSeeder::class,
            // PortalUserSeeder::class,
            // ModuleSeeder::class,
            // TopicSeeder::class,
            // LectureMaterialSeeder::class,
        ]);

        // $this->call(QuizSeeder::class);
        // $this->call(QuestionSeeder::class);
        // $this->call(AnswerSeeder::class);
        // $this->call(QuizSubmissionSeeder::class);
    }
}
