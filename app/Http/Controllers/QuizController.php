<?php

// app/Http/Controllers/QuizController.php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\quiz_attempt;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class QuizController extends Controller
{
    /**
     * Display the quiz page
     * Route: GET /modules/quiz
     */
    public function page()
    {
        return Inertia::render('Modules/quiz');
    }

    /**
     * Get all active quizzes (API)
     * Route: GET /api/quizzes
     */
    public function index()
    {
        $quizzes = Quiz::where('is_active', true)
            ->with('questions')
            ->get()
            ->map(function ($quiz) {
                return [
                    'id' => $quiz->id,
                    'title' => $quiz->title,
                    'description' => $quiz->description,
                    'duration' => $quiz->duration,
                    'questions_count' => $quiz->questions->count(),
                    'passing_score' => $quiz->passing_score,
                ];
            });

        return response()->json($quizzes);
    }

    /**
     * Get a specific quiz with questions (API)
     * Route: GET /api/quizzes/{id}
     */
    public function show($id)
    {
        try {
            $quiz = Quiz::with('questions')->findOrFail($id);

            if (!$quiz->is_active) {
                return response()->json([
                    'error' => 'This quiz is not available'
                ], 404);
            }

            // Hide correct answers
            $questions = $quiz->questions->map(function ($question) {
                return [
                    'id' => $question->id,
                    'question' => $question->question,
                    'options' => $question->options,
                    'points' => $question->points,
                ];
            });

            return response()->json([
                'id' => $quiz->id,
                'title' => $quiz->title,
                'description' => $quiz->description,
                'duration' => $quiz->duration,
                'passing_score' => $quiz->passing_score,
                'questions' => $questions,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Quiz not found'
            ], 404);
        }
    }

    /**
     * Submit quiz attempt (API)
     * Route: POST /api/quizzes/{id}/submit
     */
    public function submit(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'answers' => 'required|array',
            'started_at' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Invalid data provided',
                'messages' => $validator->errors()
            ], 422);
        }

        try {
            $quiz = Quiz::with('questions')->findOrFail($id);
            $answers = $request->input('answers');
            $startedAt = $request->input('started_at');
            $completedAt = now();

            // Calculate score
            $totalPoints = 0;
            $earnedPoints = 0;
            $correctCount = 0;
            $totalQuestions = $quiz->questions->count();

            foreach ($quiz->questions as $question) {
                $totalPoints += $question->points;
                
                if (isset($answers[$question->id]) && 
                    $question->isCorrect($answers[$question->id])) {
                    $earnedPoints += $question->points;
                    $correctCount++;
                }
            }

            $percentage = ($totalPoints > 0) ? ($earnedPoints / $totalPoints) * 100 : 0;
            $passed = $percentage >= $quiz->passing_score;
            $timeTaken = \Carbon\Carbon::parse($completedAt)->diffInSeconds($startedAt);

            // Save attempt
            $attempt = quiz_attempt::create([
                'quiz_id' => $quiz->id,
                'user_id' => Auth::id(),
                'answers' => $answers,
                'score' => $earnedPoints,
                'percentage' => $percentage,
                'passed' => $passed,
                'started_at' => $startedAt,
                'completed_at' => $completedAt,
                'time_taken' => $timeTaken,
            ]);

            return response()->json([
                'success' => true,
                'attempt_id' => $attempt->id,
                'score' => $earnedPoints,
                'total' => $totalPoints,
                'correct' => $correctCount,
                'total_questions' => $totalQuestions,
                'percentage' => round($percentage, 2),
                'passed' => $passed,
                'time_taken' => $timeTaken,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to submit quiz',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get quiz results with correct answers (API)
     * Route: GET /api/quiz-attempts/{attemptId}/results
     */
    public function results($attemptId)
    {
        try {
            $attempt = quiz_attempt::with(['quiz.questions'])->findOrFail($attemptId);

            // Check if user owns this attempt
            if ($attempt->user_id !== Auth::id()) {
                return response()->json([
                    'error' => 'Unauthorized access'
                ], 403);
            }

            $results = $attempt->quiz->questions->map(function ($question) use ($attempt) {
                $userAnswer = $attempt->answers[$question->id] ?? null;
                $isCorrect = $userAnswer === $question->correct_answer;

                return [
                    'question_id' => $question->id,
                    'question' => $question->question,
                    'options' => $question->options,
                    'user_answer' => $userAnswer,
                    'correct_answer' => $question->correct_answer,
                    'is_correct' => $isCorrect,
                    'points' => $isCorrect ? $question->points : 0,
                    'max_points' => $question->points,
                ];
            });

            return response()->json([
                'success' => true,
                'attempt_id' => $attempt->id,
                'quiz_title' => $attempt->quiz->title,
                'score' => $attempt->score,
                'percentage' => $attempt->percentage,
                'passed' => $attempt->passed,
                'time_taken' => $attempt->time_taken,
                'completed_at' => $attempt->completed_at->format('Y-m-d H:i:s'),
                'results' => $results,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Results not found'
            ], 404);
        }
    }

    /**
     * Get user's quiz history (API)
     * Route: GET /api/quiz-history
     */
    public function history()
    {
        try {
            $attempts = quiz_attempt::with('quiz')
                ->where('user_id', Auth::id())
                ->orderBy('completed_at', 'desc')
                ->get()
                ->map(function ($attempt) {
                    return [
                        'id' => $attempt->id,
                        'quiz_id' => $attempt->quiz_id,
                        'quiz_title' => $attempt->quiz->title,
                        'score' => $attempt->score,
                        'percentage' => $attempt->percentage,
                        'passed' => $attempt->passed,
                        'time_taken' => $attempt->time_taken,
                        'completed_at' => $attempt->completed_at->format('Y-m-d H:i:s'),
                    ];
                });

            return response()->json([
                'success' => true,
                'attempts' => $attempts,
                'total_attempts' => $attempts->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch quiz history',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}