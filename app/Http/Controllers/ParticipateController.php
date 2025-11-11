<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Models\Activity;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ParticipateController extends Controller
{
    public function submitActivity(Request $request, $activityId)
{
    try {
        $activity = Activity::with('participants')->findOrFail($activityId);

        $request->validate([
            'user_id' => 'required|exists:portal_users,id',
            'submission' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf,doc,docx,txt|max:10240', // 10MB max
        ]);

        $filePath = null;

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('submissions', 'public');
        }

        $activity->participants()->syncWithoutDetaching([
            $request->user_id => [
                'submission' => $request->submission,
                'file_path' => $filePath,   // Add column in pivot table
                'is_done' => true,
                'updated_at' => now(),
            ]
        ]);

        return ResponseHelper::success('Submission recorded successfully.', [
            'activity' => $activity->activity_name,
            'module' => $activity->module->module_name,
            'file' => $filePath,
        ], 200);

    } catch (ModelNotFoundException $e) {
        return ResponseHelper::error('Activity not found.', 404);
    } catch (ValidationException $e) {
        return ResponseHelper::invalid('Validation failed.', $e->errors());
    } catch (Exception $e) {
        return ResponseHelper::error('An error occurred while submitting the activity.', 500, $e->getMessage());
    }
}



    public function fetchSubmissions($activityId)
    {
        try {
            $activity = Activity::with(['participants' => function ($query) {
                $query->select('portal_users.id', 'portal_users.full_name', 'portal_users.email', 'submission', 'marks', 'is_done');
            }])->findOrFail($activityId);

            return ResponseHelper::success('Submissions fetched successfully.', [
                'activity_name' => $activity->activity_name,
                'submissions' => $activity->participants,
            ], 200);

        } catch (ModelNotFoundException $e) {
            return ResponseHelper::error('Activity not found.', 404);
        } catch (Exception $e) {
            return ResponseHelper::error('An error occurred while fetching submissions.', 500, $e->getMessage());
        }
    }


    public function gradeSubmission(Request $request, $activityId, $userId)
    {
        try {
            $request->validate([
                'marks' => 'required|integer|min:0', // Ensure valid marks
            ]);

            $updated = DB::table('participants')
                ->where('activity_id', $activityId)
                ->where('user_id', $userId)
                ->update([
                    'marks' => $request->marks,
                    'updated_at' => now(),
                ]);

            if ($updated) {
                return ResponseHelper::success('Marks updated successfully.', [], 200);
            }

            return ResponseHelper::error('Failed to update marks.', 400);

        } catch (ValidationException $e) {
            return ResponseHelper::validationError('Validation failed.', $e->errors());
        } catch (Exception $e) {
            return ResponseHelper::error('An error occurred while grading the submission.', 500, $e->getMessage());
        }
    }


}
