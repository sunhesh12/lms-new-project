<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\QuizQuestion;
use App\Models\NewQuiz; // Import Quiz model to get existing quiz IDs

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure quizzes exist before trying to attach questions
        $quiz1 = NewQuiz::where('title', 'Introduction to PHP Quiz')->first();
        $quiz2 = NewQuiz::where('title', 'Laravel Basics Assessment')->first();
        $quiz3 = NewQuiz::where('title', 'Frontend HTML/CSS Challenge')->first();
        $quiz4 = NewQuiz::where('title', 'JavaScript Fundamentals Quiz')->first();
        $quiz5 = NewQuiz::where('title', 'Database SQL Queries Test')->first();

        // Question 1 (Single Choice)
        if ($quiz1) {
            QuizQuestion::create([
                'quiz_id' => $quiz1->id,
                'question_text' => 'Which keyword is used to define a function in PHP?',
                'question_type' => 'single_choice',
                'points' => 10,
            ]);
        }

        // Question 2 (Multiple Choice)
        if ($quiz2) {
            QuizQuestion::create([
                'quiz_id' => $quiz2->id,
                'question_text' => 'Which of the following are valid ways to define a route in Laravel?',
                'question_type' => 'multiple_choice',
                'points' => 15,
            ]);
        }

        // Question 3 (Writing)
        if ($quiz3) {
            QuizQuestion::create([
                'quiz_id' => $quiz3->id,
                'question_text' => 'Explain the difference between `display: block;` and `display: inline-block;` in CSS.',
                'question_type' => 'writing',
                'points' => 20,
            ]);
        }

        // Question 4 (Single Choice with Image)
        if ($quiz4) {
            QuizQuestion::create([
                'quiz_id' => $quiz4->id,
                'question_text' => 'What is the output of the following JavaScript code?',
                'question_type' => 'single_choice',
                'image_url' => 'question_images/sample_code.png', // ✨ Make sure this image path exists in storage/app/public
                'points' => 10,
            ]);
        }

        // Question 5 (Multiple Choice)
        if ($quiz5) {
            QuizQuestion::create([
                'quiz_id' => $quiz5->id,
                'question_text' => 'Which SQL clauses are used to filter rows from a query result?',
                'question_type' => 'multiple_choice',
                'points' => 12,
            ]);
        }
    }
}
