<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Models\Activity;
use App\Models\Question;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    // public function addQuestion(Request $request, $quizId)
    // {
    //     try {
    //         $quiz = Activity::where('id', $quizId)->where('type', 'quiz')->firstOrFail();

    //         $request->validate([
    //             'questions' => 'required|array',
    //             'questions.*.question_number' => 'required|integer',
    //             'questions.*.question' => 'required|string',
    //             'questions.*.question_type' => 'required|in:single_answer,multiple_choice',
    //             'questions.*.answer' => 'required|string',
    //             'questions.*.options' => 'nullable|array',
    //         ]);

    //         $currentQuestionCount = $quiz->questions()->count();
    //         $newQuestionCount = count($request->questions);
    //         $maxQuestions = $quiz->question_count;

    //         if (($currentQuestionCount + $newQuestionCount) > $maxQuestions) {
    //             return ResponseHelper::validationError('Cannot add more questions. Maximum question count exceeded.');
    //         }

    //         foreach ($request->questions as $questionData) {
    //             $quiz->questions()->create($questionData);
    //         }

    //         return ResponseHelper::success('Questions added successfully.');
    //     } catch (ModelNotFoundException $e) {
    //         return ResponseHelper::notFound('Quiz not found.');
    //     } catch (Exception $e) {
    //         return ResponseHelper::serverError('An error occurred while adding questions.', $e->getMessage());
    //     }
    // }

    // ========================================start testing code============================================
// ===============================================heshan===============================================
public function addQuestion(Request $request, $quizId)
{
    // Check if request payload is coming
    // return response()->json($request->all()); // Uncomment to debug

    $quiz = Activity::where('id', $quizId)
        ->where('type', 'quiz')
        ->first();

    if (!$quiz) {
        return response()->json(['message' => 'Quiz not found.'], 404);
    }

    $questions = $request->input('questions', []);

    if (empty($questions)) {
        return response()->json(['message' => 'No questions received.'], 400);
    }

    foreach ((array)$questions as $questionData) {
        $quiz->questions()->create($questionData);
    }

    return response()->json(['message' => 'Questions added successfully.']);
}


// ===========================================================================================================
//========================================end=================================================================

    public function getQuestions($quizId)
    {
        try {
            $quiz = Activity::where('id', $quizId)
                ->where('type', 'quiz')
                ->with('questions')
                ->firstOrFail();

            return ResponseHelper::success('Questions retrieved successfully.', $quiz->questions);
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::notFound('Quiz not found.');
        } catch (Exception $e) {
            return ResponseHelper::serverError('An error occurred while retrieving questions.', $e->getMessage());
        }
    }

    public function updateQuestion(Request $request, $quizId, $questionId)
    {
        try {
            $request->validate([
                'question_number' => 'integer',
                'question' => 'string',
                'question_type' => 'in:single_answer,multiple_choice',
                'answer' => 'string|nullable',
                'options' => 'array|nullable',
            ]);

            $question = Question::where('id', $questionId)
                ->where('quiz_id', $quizId)
                ->firstOrFail();

            $question->update($request->all());

            return ResponseHelper::success('Question updated successfully.', $question);
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::notFound('Question not found for the specified quiz.');
        } catch (Exception $e) {
            return ResponseHelper::serverError('An error occurred while updating the question.', $e->getMessage());
        }
    }

    public function deleteAllQuestion($quizId)
    {
        try {
            $quiz = Activity::where('id', $quizId)
                ->where('type', 'quiz')
                ->with('questions')
                ->firstOrFail();

            $quiz->questions()->delete();

            return ResponseHelper::success('All questions deleted successfully.');
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::notFound('Quiz not found.');
        } catch (Exception $e) {
            return ResponseHelper::serverError('An error occurred while deleting all questions.', $e->getMessage());
        }
    }

    public function deleteSpecificQuestion($quizId, $questionId)
    {
        try {
            $question = Question::where('id', $questionId)
                ->where('quiz_id', $quizId)
                ->firstOrFail();

            $question->delete();

            return ResponseHelper::success('Question deleted successfully.');
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::notFound('Question not found for the specified quiz.');
        } catch (Exception $e) {
            return ResponseHelper::serverError('An error occurred while deleting the question.', $e->getMessage());
        }
    }
}
