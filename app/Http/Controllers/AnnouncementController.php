<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Models\Announcement;
use App\Models\Answer;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AnnouncementController extends Controller
{
    public function addAnswer(Request $request, $announcementId)
    {
        try {
            $announcement = Announcement::findOrFail($announcementId);

            $request->validate([
                'description' => 'required|string',
                'user_id' => 'required|exists:portal_users,id', // Ensure the user exists
            ]);

            $answer = $announcement->answers()->create([
                'description' => $request->description,
                'user_id' => $request->user_id,
            ]);

            return ResponseHelper::success('Answer added successfully.', $answer, 201);
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::notFound('Announcement not found.');
        } catch (ValidationException $e) {
            return ResponseHelper::validationError('Validation failed.', $e->errors());
        } catch (Exception $e) {
            return ResponseHelper::serverError('An error occurred while adding the answer.', $e->getMessage());
        }
    }

    public function getAnswers($announcementId)
    {
        try {
            $announcement = Announcement::with('answers.user')->findOrFail($announcementId);

            return ResponseHelper::success('Answers retrieved successfully.', $announcement->answers);
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::notFound('Announcement not found.');
        } catch (Exception $e) {
            return ResponseHelper::serverError('An error occurred while retrieving answers.', $e->getMessage());
        }
    }

    public function updateAnswer(Request $request, $announcementId, $answerId)
    {
        try {
            $answer = Answer::where('id', $answerId)
                ->where('announcement_id', $announcementId)
                ->firstOrFail();

            if ($answer->user_id !== auth()->id()) {
                return ResponseHelper::forbidden('You are not authorized to update this answer.');
            }

            $request->validate([
                'description' => 'required|string',
            ]);

            $answer->update([
                'description' => $request->description,
            ]);

            return ResponseHelper::success('Answer updated successfully.', $answer);
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::notFound('Answer not found.');
        } catch (ValidationException $e) {
            return ResponseHelper::validationError('Validation failed.', $e->errors());
        } catch (Exception $e) {
            return ResponseHelper::serverError('An error occurred while updating the answer.', $e->getMessage());
        }
    }

    public function deleteAnswer($announcementId, $answerId)
    {
        try {
            $answer = Answer::where('id', $answerId)
                ->where('announcement_id', $announcementId)
                ->firstOrFail();

            if ($answer->user_id !== auth()->id()) {
                return ResponseHelper::forbidden('You are not authorized to delete this answer.');
            }

            $answer->delete();

            return ResponseHelper::success('Answer deleted successfully.');
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::notFound('Answer not found.');
        } catch (Exception $e) {
            return ResponseHelper::serverError('An error occurred while deleting the answer.', $e->getMessage());
        }
    }
}
