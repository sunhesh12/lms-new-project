<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\NewQuiz;
use Carbon\Carbon;

class QuizSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        NewQuiz::create([
            'topic_id' => 1, // Ensure this topic_id exists
            'title' => 'Introduction to PHP Quiz',
            'description' => 'A basic quiz covering fundamental PHP concepts.',
            'deadline' => Carbon::now()->addDays(7),
            'duration_minutes' => 30,
            'pass_percentage' => 60.00,
            'is_published' => true,
        ]);

        NewQuiz::create([
            'topic_id' => 1, // Ensure this topic_id exists
            'title' => 'Laravel Basics Assessment',
            'description' => 'Test your knowledge on Laravel routing, controllers, and models.',
            'deadline' => Carbon::now()->addDays(14),
            'duration_minutes' => 45,
            'pass_percentage' => 70.00,
            'is_published' => true,
        ]);

        NewQuiz::create([
            'topic_id' => 2, // Ensure this topic_id exists
            'title' => 'Frontend HTML/CSS Challenge',
            'description' => 'Questions on HTML structure and CSS styling.',
            'deadline' => Carbon::now()->addDays(10),
            'duration_minutes' => 25,
            'pass_percentage' => 50.00,
            'is_published' => true,
        ]);

        NewQuiz::create([
            'topic_id' => 2, // Ensure this topic_id exists
            'title' => 'JavaScript Fundamentals Quiz',
            'description' => 'Covers variables, data types, functions, and DOM manipulation.',
            'deadline' => Carbon::now()->addDays(21),
            'duration_minutes' => 60,
            'pass_percentage' => 75.00,
            'is_published' => false, // Not yet published
        ]);

        NewQuiz::create([
            'topic_id' => 3, // Ensure this topic_id exists
            'title' => 'Database SQL Queries Test',
            'description' => 'Practice writing SELECT, INSERT, UPDATE, DELETE queries.',
            'deadline' => Carbon::now()->addDays(9),
            'duration_minutes' => 30,
            'pass_percentage' => 65.00,
            'is_published' => true,
        ]);
    }
}
