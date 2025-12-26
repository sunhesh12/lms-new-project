<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\QuizAnswer;
use App\Models\QuizQuestion; // ✨ Correctly import QuizQuestion model (removed NewQuestion)

class AnswerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure quiz questions exist by fetching them
        $q1 = QuizQuestion::where('question_text', 'Which keyword is used to define a function in PHP?')->first();
        $q2 = QuizQuestion::where('question_text', 'Which of the following are valid ways to define a route in Laravel?')->first();
        $q4 = QuizQuestion::where('question_text', 'What is the output of the following JavaScript code?')->first();
        $q5 = QuizQuestion::where('question_text', 'Which SQL clauses are used to filter rows from a query result?')->first();

        // Answers for Q1 (Single Choice)
        if ($q1) {
            QuizAnswer::create(['quizquestion_id' => $q1->id, 'answer_text' => 'func', 'is_correct' => false]);
            QuizAnswer::create(['quizquestion_id' => $q1->id, 'answer_text' => 'function', 'is_correct' => true]);
            QuizAnswer::create(['quizquestion_id' => $q1->id, 'answer_text' => 'define_function', 'is_correct' => false]);
            QuizAnswer::create(['quizquestion_id' => $q1->id, 'answer_text' => 'def', 'is_correct' => false]);
        }

        // Answers for Q2 (Multiple Choice)
        if ($q2) {
            QuizAnswer::create(['quizquestion_id' => $q2->id, 'answer_text' => 'Route::get(\'/url\', ...);', 'is_correct' => true]);
            QuizAnswer::create(['quizquestion_id' => $q2->id, 'answer_text' => 'Route::post(\'/url\', ...);', 'is_correct' => true]);
            QuizAnswer::create(['quizquestion_id' => $q2->id, 'answer_text' => 'Route::route(\'/url\', ...);', 'is_correct' => false]);
            QuizAnswer::create(['quizquestion_id' => $q2->id, 'answer_text' => 'Route::any(\'/url\', ...);', 'is_correct' => true]);
        }

        // Answers for Q4 (Single Choice with Image) - assuming the image shows `console.log(2 + '2');`
        if ($q4) {
            QuizAnswer::create(['quizquestion_id' => $q4->id, 'answer_text' => '4', 'is_correct' => false]);
            QuizAnswer::create(['quizquestion_id' => $q4->id, 'answer_text' => '22', 'is_correct' => true]);
            QuizAnswer::create(['quizquestion_id' => $q4->id, 'answer_text' => 'Error', 'is_correct' => false]);
            QuizAnswer::create(['quizquestion_id' => $q4->id, 'answer_text' => 'NaN', 'is_correct' => false]);
        }

        // Answers for Q5 (Multiple Choice)
        if ($q5) {
            QuizAnswer::create(['quizquestion_id' => $q5->id, 'answer_text' => 'WHERE', 'is_correct' => true]);
            QuizAnswer::create(['quizquestion_id' => $q5->id, 'answer_text' => 'HAVING', 'is_correct' => true]);
            QuizAnswer::create(['quizquestion_id' => $q5->id, 'answer_text' => 'GROUP BY', 'is_correct' => false]);
            QuizAnswer::create(['quizquestion_id' => $q5->id, 'answer_text' => 'ORDER BY', 'is_correct' => false]);
        }
    }
}
