<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class QuizController extends Controller
{
    /**
     * Display the quiz page (Student)
     */
    public function page(Request $request)
    {
        return Inertia::render('Modules/quiz', [
            'initialQuizId' => $request->query('quiz_id')
        ]);
    }

    /**
     * Get all active quizzes (API - Student)
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
     * Get a specific quiz with questions (API - Student)
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

            // Hide correct answers but include images
            $questions = $quiz->questions->map(function ($question) {
                return [
                    'id' => $question->id,
                    'question' => $question->question,
                    'image_url' => $question->image_url ? asset($question->image_url) : null,
                    'options' => $question->options,
                    'points' => $question->points,
                    'order' => $question->order,
                ];
            });

            // Check attempts for students
            $userAttempts = 0;
            $canAttempt = true;
            if (auth()->user()->isStudent()) {
                $userAttempts = QuizAttempt::where('quiz_id', $quiz->id)
                    ->where('user_id', auth()->id())
                    ->count();
                
                if (!$quiz->allow_multiple_attempts && $userAttempts >= 1) {
                    $canAttempt = false;
                } elseif ($quiz->allow_multiple_attempts && $quiz->max_attempts > 0 && $userAttempts >= $quiz->max_attempts) {
                    $canAttempt = false;
                }
            }

            return response()->json([
                'quiz' => [
                    'id' => $quiz->id,
                    'title' => $quiz->title,
                    'description' => $quiz->description,
                    'duration' => $quiz->duration,
                    'passing_score' => $quiz->passing_score,
                    'allow_multiple_attempts' => $quiz->allow_multiple_attempts,
                    'max_attempts' => $quiz->max_attempts,
                    'user_attempts' => $userAttempts,
                    'can_attempt' => $canAttempt,
                ],
                'questions' => $questions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Quiz not found'
            ], 404);
        }
    }

    /**
     * Submit quiz attempt (API - Student)
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
            $timeTaken = now()->diffInSeconds(\Carbon\Carbon::parse($startedAt));

            // Save attempt
            $attempt = QuizAttempt::create([
                'quiz_id' => $quiz->id,
                'user_id' => Auth::id(),
                'answers' => $answers,
                'score' => $earnedPoints,
                'percentage' => round($percentage, 2),
                'passed' => $passed,
                'started_at' => \Carbon\Carbon::parse($startedAt),
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
     * Get quiz results with correct answers (API - Student)
     */
    public function results($attemptId)
    {
        try {
            $attempt = QuizAttempt::with(['quiz.questions'])->findOrFail($attemptId);

            if ($attempt->user_id !== Auth::id()) {
                return response()->json(['error' => 'Unauthorized access'], 403);
            }

            $results = $attempt->quiz->questions->map(function ($question) use ($attempt) {
                $userAnswer = $attempt->answers[$question->id] ?? null;
                $isCorrect = $userAnswer === $question->correct_answer;

                return [
                    'question_id' => $question->id,
                    'question' => $question->question,
                    'image_url' => $question->image_url ? asset($question->image_url) : null,
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
            return response()->json(['error' => 'Results not found'], 404);
        }
    }

    /**
     * Get user's quiz history (API - Student)
     */
    public function history()
    {
        try {
            $attempts = QuizAttempt::with('quiz')
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
            return response()->json(['error' => 'Failed to fetch history'], 500);
        }
    }

    /**
     * Store a new quiz (Staff)
     */
    public function store(Request $request)
    {
        if (auth()->user()->isStudent()) abort(403);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'required|integer|min:0',
            'passing_score' => 'required|integer|min:0|max:100',
            'module_id' => 'required|exists:modules,id',
            'allow_multiple_attempts' => 'boolean',
            'max_attempts' => 'integer|min:0',
        ]);

        Quiz::create($request->all());
        return redirect()->back()->with('message', 'Quiz created successfully');
    }

    /**
     * Update a quiz (Staff)
     */
    public function update(Request $request, $id)
    {
        if (auth()->user()->isStudent()) abort(403);

        $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'duration' => 'integer|min:0',
            'passing_score' => 'integer|min:0|max:100',
            'allow_multiple_attempts' => 'boolean',
            'max_attempts' => 'integer|min:0',
        ]);

        $quiz = Quiz::findOrFail($id);
        $quiz->update($request->all());
        return redirect()->back()->with('message', 'Quiz updated successfully');
    }

    /**
     * Delete a quiz (Staff)
     */
    public function destroy($id)
    {
        if (auth()->user()->isStudent()) abort(403);

        $quiz = Quiz::findOrFail($id);
        $quiz->delete();
        return redirect()->back()->with('message', 'Quiz deleted successfully');
    }

    /**
     * Add or update questions (Staff)
     */
    public function syncQuestions(Request $request, $quizId)
    {
        if (auth()->user()->isStudent()) abort(403);

        $quiz = Quiz::findOrFail($quizId);

        $request->validate([
            'questions' => 'required|array',
            'questions.*.id' => 'nullable',
            'questions.*.question' => 'required|string',
            'questions.*.options' => 'required|array|min:2',
            'questions.*.correct_answer' => 'required|integer',
            'questions.*.points' => 'required|integer|min:1',
            'questions.*.image' => 'nullable|image|max:2048',
        ]);

        foreach ($request->questions as $index => $qData) {
            $imagePath = null;
            if ($request->hasFile("questions.$index.image")) {
                $file = $request->file("questions.$index.image");
                $fileName = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('storage/uploads/quizzes/'), $fileName);
                $imagePath = 'storage/uploads/quizzes/' . $fileName;
            }

            if (!empty($qData['id'])) {
                $question = $quiz->questions()->find($qData['id']);
                if ($question) {
                    $updateData = [
                        'question' => $qData['question'],
                        'options' => $qData['options'],
                        'correct_answer' => $qData['correct_answer'],
                        'points' => $qData['points'],
                        'order' => $index,
                    ];
                    if ($imagePath) $updateData['image_url'] = $imagePath;
                    $question->update($updateData);
                }
            } else {
                $quiz->questions()->create([
                    'question' => $qData['question'],
                    'options' => $qData['options'],
                    'correct_answer' => $qData['correct_answer'],
                    'points' => $qData['points'],
                    'order' => $index,
                    'image_url' => $imagePath,
                ]);
            }
        }
        return redirect()->back()->with('message', 'Questions synced successfully');
    }

    /**
     * Delete a question (Staff)
     */
    public function deleteQuestion($quizId, $questionId)
    {
        if (auth()->user()->isStudent()) abort(403);
        $question = \App\Models\Question::where('quiz_id', $quizId)->findOrFail($questionId);
        $question->delete();
        return redirect()->back()->with('message', 'Question deleted successfully');
    }
}