<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewQuiz;
use App\Models\QuizQuestion;
use App\Models\Quiz;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class QuestionController extends Controller
{
    /**
     * Store a newly created question for a specific quiz.
     */
    public function index()
    {
        $Newquizzes = NewQuiz::all();
        return response()->json($Newquizzes);
    }



    public function store(Request $request, Quiz $quiz)
    {
        $validator = Validator::make($request->all(), [
            'question_text' => 'required|string',
            'question_type' => 'required|in:single_choice,multiple_choice,writing', // ✨ Add 'writing'
            'image' => 'nullable|image|max:2048', // ✨ New rule for image upload
            'points' => 'required|integer|min:1',
            'answers' => 'required_if:question_type,single_choice,multiple_choice|array|min:2',
            'answers.*.answer_text' => 'required|string',
            'answers.*.is_correct' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('question_images', 'public');
        }

        $question = $quiz->questions()->create([
            'question_text' => $request->question_text,
            'question_type' => $request->question_type,
            'image_url' => $imagePath, // ✨ Store the image path
            'points' => $request->points,
        ]);

        if ($request->question_type !== 'writing' && !empty($request->answers)) {
            foreach ($request->answers as $answerData) {
                $question->answers()->create($answerData);
            }
        }

        return response()->json($question->load('answers'), 201);
    }

    /**
     * Update the specified question.
     */
    public function update(Request $request, Quiz $quiz, QuizQuestion $question)
    {
        if ($question->quiz_id !== $quiz->id) {
            return response()->json(['message' => 'Question not found in this quiz.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'question_text' => 'sometimes|required|string',
            'question_type' => 'sometimes|required|in:single_choice,multiple_choice,writing',
            'image' => 'nullable|image|max:2048', // Allow new image or remove
            'points' => 'sometimes|required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            if ($question->image_url) {
                Storage::disk('public')->delete($question->image_url);
            }
            $data['image_url'] = $request->file('image')->store('question_images', 'public');
        } elseif ($request->has('remove_image')) {
            if ($question->image_url) {
                Storage::disk('public')->delete($question->image_url);
                $data['image_url'] = null;
            }
        }

        $question->update($data);
        return response()->json($question);
    }
}