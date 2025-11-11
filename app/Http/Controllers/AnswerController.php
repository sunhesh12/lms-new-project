<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\QuizAnswer;
use App\Models\QuizQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AnswerController extends Controller
{
    /**
     * Display a listing of the answers for a specific question.
     */
    public function index(QuizQuestion $question)
    {

    $questions = QuizAnswer::all();
    return response()->json($questions);
    }

    /**
     * Store a newly created answer in storage.
     */
    public function store(Request $request, QuizQuestion $question)
    {
        $validator = Validator::make($request->all(), [
            'answer_text' => 'required|string',
            'is_correct' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $answer = $question->answers()->create($request->all());

        return response()->json($answer, 201);
    }

    /**
     * Display the specified answer.
     */
    public function show(QuizQuestion $question, QuizAnswer $answer)
    {
        // Ensure the answer belongs to the question
        if ($answer->question_id !== $question->id) {
            return response()->json(['message' => 'Answer not found for this question.'], 404);
        }

        return response()->json($answer);
    }

    /**
     * Update the specified answer in storage.
     */
    public function update(Request $request, QuizQuestion $question, QuizAnswer $answer)
    {
        // Ensure the answer belongs to the question
        if ($answer->question_id !== $question->id) {
            return response()->json(['message' => 'Answer not found for this question.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'answer_text' => 'sometimes|required|string',
            'is_correct' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $answer->update($request->all());

        return response()->json($answer);
    }

    /**
     * Remove the specified answer from storage.
     */
    public function destroy(QuizQuestion $question, QuizAnswer $answer)
    {
        // Ensure the answer belongs to the question
        if ($answer->question_id !== $question->id) {
            return response()->json(['message' => 'Answer not found for this question.'], 404);
        }
        
        $answer->delete();

        return response()->json(null, 204);
    }
}