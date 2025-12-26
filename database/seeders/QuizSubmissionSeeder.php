<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\QuizSubmission;
use App\Models\NewQuiz;
use App\Models\QuizQuestion;
use App\Models\QuizAnswer;
use App\Models\PortalUser; // Assuming PortalUser is your user model

class QuizSubmissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure a user exists (e.g., from PortalUserSeeder or factories)
        // If not, you might create one here or ensure your existing user seeder runs first
        $user = PortalUser::first();
        if (!$user) {
            // Fallback: Create a user if none exists for seeding submissions
            $user = PortalUser::factory()->create(); // Requires PortalUserFactory
        }

        // Get some quizzes and questions/answers
        $quiz1 = NewQuiz::where('title', 'Introduction to PHP Quiz')->first();
        $q1 = QuizQuestion::where('question_text', 'Which keyword is used to define a function in PHP?')->first();
        $a1_correct = QuizAnswer::where('quizquestion_id', $q1->id ?? null)->where('is_correct', true)->first();
        $a1_incorrect = QuizAnswer::where('quizquestion_id', $q1->id ?? null)->where('is_correct', false)->first();

        $quiz2 = NewQuiz::where('title', 'Laravel Basics Assessment')->first();
        $q2 = QuizQuestion::where('question_text', 'Which of the following are valid ways to define a route in Laravel?')->first();
        $q2_answers_correct = QuizAnswer::where('quizquestion_id', $q2->id ?? null)->where('is_correct', true)->pluck('id')->toArray();

        $quiz3 = NewQuiz::where('title', 'Frontend HTML/CSS Challenge')->first();
        $q3_writing = QuizQuestion::where('question_text', 'Explain the difference between `display: block;` and `display: inline-block;` in CSS.')->first();

        $quiz4 = NewQuiz::where('title', 'JavaScript Fundamentals Quiz')->first();
        $q4 = QuizQuestion::where('question_text', 'What is the output of the following JavaScript code?')->first();
        $a4_correct = QuizAnswer::where('quizquestion_id', $q4->id ?? null)->where('is_correct', true)->first();

        $quiz5 = NewQuiz::where('title', 'Database SQL Queries Test')->first();
        $q5 = QuizQuestion::where('question_text', 'Which SQL clauses are used to filter rows from a query result?')->first();
        $q5_answers_correct = QuizAnswer::where('quizquestion_id', $q5->id ?? null)->where('is_correct', true)->pluck('id')->toArray();


        if ($user && $quiz1 && $q1 && $a1_correct && $a1_incorrect) {
            QuizSubmission::create([
                'user_id' => $user->id,
                'quiz_id' => $quiz1->id,
                'submitted_answers' => json_encode([
                    ['quizquestion_id' => $q1->id, 'selected_answer_ids' => [$a1_correct->id]],
                ]),
                'score' => 10,
                'percentage_score' => 100.00,
                'is_passed' => true,
            ]);
        }

        if ($user && $quiz2 && $q2 && !empty($q2_answers_correct)) {
            QuizSubmission::create([
                'user_id' => $user->id,
                'quiz_id' => $quiz2->id,
                'submitted_answers' => json_encode([
                    ['quizquestion_id' => $q2->id, 'selected_answer_ids' => $q2_answers_correct], // Correctly answered multiple choice
                ]),
                'score' => 15, // Max points for Q2
                'percentage_score' => 100.00,
                'is_passed' => true,
            ]);
        }

        if ($user && $quiz3 && $q3_writing) {
            QuizSubmission::create([
                'user_id' => $user->id,
                'quiz_id' => $quiz3->id,
                'submitted_answers' => json_encode([
                    ['quizquestion_id' => $q3_writing->id, 'submitted_text_answer' => 'Block elements take up full width, inline-block elements take only necessary width and allow setting height/width.'],
                ]),
                'score' => null, // Writing questions need manual grading
                'percentage_score' => null,
                'is_passed' => null,
            ]);
        }

        if ($user && $quiz4 && $q4 && $a4_correct) {
            QuizSubmission::create([
                'user_id' => $user->id,
                'quiz_id' => $quiz4->id,
                'submitted_answers' => json_encode([
                    ['quizquestion_id' => $q4->id, 'selected_answer_ids' => [$a4_correct->id]],
                ]),
                'score' => 10,
                'percentage_score' => 100.00,
                'is_passed' => true,
            ]);
        }

        if ($user && $quiz5 && $q5 && !empty($q5_answers_correct)) {
             QuizSubmission::create([
                'user_id' => $user->id,
                'quiz_id' => $quiz5->id,
                'submitted_answers' => json_encode([
                    // Simulate an incorrect submission for a multiple choice question
                    ['quizquestion_id' => $q5->id, 'selected_answer_ids' => [$q5_answers_correct[0]]], // Only one correct answer selected
                ]),
                'score' => 0, // Incorrectly answered if not all correct options are selected
                'percentage_score' => 0.00,
                'is_passed' => false,
            ]);
        }
    }
}
