<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\NewQuiz;
use App\Models\QuizQuestion;
use App\Models\Topic;
use App\Models\QuizSubmission; // ✨ Import the new model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class QuizController extends Controller
{
    // ... index, show, update, destroy methods from previous answer ...
    // Make sure to add 'deadline' to the validation rules in store and update methods.
    
    /**
     * Store a newly created quiz in storage.
     */

    public function index()
    {
        $quizzes = QuizQuestion::all();
        return response()->json($quizzes);
    }

    public function showQuizzes()
    {
        $quizzes = NewQuiz::all();
        return response()->json($quizzes);
    }



    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'topic_id' => 'required|exists:topics,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date', // ✨ Add deadline validation
            'duration_minutes' => 'nullable|integer|min:1',
            'pass_percentage' => 'required|numeric|min:0|max:100',
            'is_published' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $quiz = NewQuiz::create($request->all());
        return response()->json($quiz, 201);
    }

    /**
     * Submit a quiz and calculate score.
     */
    public function submitQuiz(Request $request, NewQuiz $quiz)
    {
        // ... (Existing validation)
        $validator = Validator::make($request->all(), [
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.selected_answer_ids' => 'sometimes|array',
            'answers.*.selected_answer_ids.*' => 'exists:answers,id',
            'answers.*.submitted_text_answer' => 'sometimes|string', // ✨ Add writing answer validation
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $totalPoints = 0;
        $earnedPoints = 0;
        $submittedAnswers = collect($request->answers);

        $quizQuestions = $quiz->questions()->with('answers')->get();

        foreach ($quizQuestions as $question) {
            $totalPoints += $question->points;
            $submission = $submittedAnswers->where('question_id', $question->id)->first();

            if (!$submission) {
                continue; // Student did not answer this question
            }

            if ($question->question_type === 'writing') {
                // Writing questions are not auto-graded. They must be manually graded later.
                // We'll just store the answer for now.
                continue;
            }

            // For single/multiple choice:
            $correctAnswerIds = $question->answers->where('is_correct', true)->pluck('id')->toArray();
            $selectedAnswerIds = $submission['selected_answer_ids'] ?? [];

            sort($correctAnswerIds);
            sort($selectedAnswerIds);

            if ($correctAnswerIds == $selectedAnswerIds) {
                $earnedPoints += $question->points;
            }
        }

        $percentageScore = ($totalPoints > 0) ? ($earnedPoints / $totalPoints) * 100 : 0;
        $isPassed = $percentageScore >= $quiz->pass_percentage;
        $user = Auth::user();

        // Store the submission in the database
        QuizSubmission::create([
            'user_id' => $user->id,
            'quiz_id' => $quiz->id,
            'submitted_answers' => $submittedAnswers->toJson(),
            'score' => $earnedPoints,
            'percentage_score' => $percentageScore,
            'is_passed' => $isPassed,
        ]);

        return response()->json([
            'message' => 'Quiz submitted successfully!',
            'score' => $earnedPoints,
            'total_points' => $totalPoints,
            'percentage_score' => round($percentageScore, 2),
            'pass_percentage_required' => $quiz->pass_percentage,
            'is_passed' => $isPassed,
        ]);
    }
}