<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Models\Activity;
use App\Models\Announcement;
use App\Models\Module;
use App\Models\PortalUser;
use App\Models\Topic;
use Exception;
use GuzzleHttp\Psr7\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ModuleController extends Controller
{
    public function archiveModule(Request $request, $id)
    {
        try {

            $module = Module::find($id);

            if (!$module) {
                return ResponseHelper::notFound('Module not found');
            }

            $module->update([
                'archived' => true, // Set archived to true
            ]);

            $module->save();

            return ResponseHelper::success('Module archived successfully', null);
        } catch (QueryException $qe) {
            return ResponseHelper::serverError($qe->getMessage());
        } catch (ModelNotFoundException $mnfe) {
            return ResponseHelper::notFound('Module not found');
        } catch (Exception $e) {
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function unarchiveModule(Request $request, $id)
    {
        try {

            $module = Module::find($id);

            if (!$module) {
                return ResponseHelper::notFound('Module not found');
            }

            $module->update([
                'archived' => false, // Set archived to true
            ]);

            $module->save();

            return ResponseHelper::success('Module unarchived successfully', null);
        } catch (QueryException $qe) {
            return ResponseHelper::serverError($qe->getMessage());
        } catch (ModelNotFoundException $mnfe) {
            return ResponseHelper::notFound('Module not found');
        } catch (Exception $e) {
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function showAllModules(Request $request)
    {
        try {
            $modules = Module::with('courses')->get(); // Fetch all modules

            // Use the ResponseHelper to return a success response
            return ResponseHelper::success('Modules retrieved successfully', $modules);
        } catch (Exception $e) {
            // Catch any general exceptions and use ResponseHelper for error response
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function getModuleById(Request $request, $id)
    {
        try {
            $module = Module::with(['activities', 'topics.lectureMaterials', 'teachers', 'announcements'])->get()->where('id', '=', $id)->first(); // Fetch all users
            if (!$module) {
                // Return a not found error if the module doesn't exist
                return ResponseHelper::notFound('Module not found');
            }
            // Use the ResponseHelper to return a success response
            return ResponseHelper::success('Modules retrieved successfully', $module);
        } catch (Exception $e) {
            // Catch any general exceptions and use ResponseHelper for error response
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function addModule(Request $request)
    {
        try {
            $validated = $request->validate([
                'module_name' => 'required|string|max:255',
                'credit_value' => 'nullable|integer',
                'practical_exam_count' => 'nullable|integer',
                'writing_exam_count' => 'nullable|integer',
                'course_id' => 'required|exists:courses,id',
                'archived' => 'boolean', // Optional field for archiving
            ]);
            $module = Module::create($validated);
            return ResponseHelper::success('Module created successfully', $module);
        } catch (QueryException $qe) {
            return ResponseHelper::serverError($qe->getMessage());
        } catch (Exception $e) {
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function updateModuleById(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'module_name' => 'sometimes|string|max:255',
                'credit_value' => 'sometimes|nullable|integer',
                'practical_exam_count' => 'sometimes|nullable|integer',
                'writing_exam_count' => 'sometimes|nullable|integer',
                'course_id' => 'sometimes|exists:courses,id',
                'archived' => 'sometimes|boolean', // Optional field for archiving
            ]);

            $module = Module::find($id);

            if (!$module) {
                return ResponseHelper::notFound('Module not found');
            }

            $module->update($validated);

            return ResponseHelper::success('Module updated successfully', $module);
        } catch (QueryException $qe) {
            return ResponseHelper::serverError($qe->getMessage());
        } catch (ModelNotFoundException $mnfe) {
            return ResponseHelper::notFound('Module not found');
        } catch (Exception $e) {
            return ResponseHelper::serverError($e->getMessage());
        }
    }


    public function deleteModuleById($id, Request $request)
    {
        if (!$request->isMethod('delete')) {
            return ResponseHelper::methodInvalid();
        }
        try {
            Module::where('id', $id)->delete();
            return ResponseHelper::success('Module with id ' . $id . ' deleted successfully.');
        } catch (QueryException $qe) {
            return ResponseHelper::serverError($qe->getMessage());
        }
    }

    public function getAllAssignments($id)
    {
        try {
            $assignments = Activity::where('module_id', $id)
                ->where('type', 'assignment')
                ->get();

            return ResponseHelper::success('Assignments retrieved successfully.', $assignments);
        } catch (Exception $e) {
            return ResponseHelper::serverError('An error occurred while retrieving assignments.', $e->getMessage());
        }
    }

    public function getAllQuizes($id)
    {
        try {
            $quizzes = Activity::where('module_id', $id)
                ->where('type', 'quiz')
                ->get();

            return ResponseHelper::success('Quizzes retrieved successfully.', $quizzes);
        } catch (Exception $e) {
            return ResponseHelper::serverError('An error occurred while retrieving quizzes.', $e->getMessage());
        }
    }

    public function getAllActivitiesForAModule($id)
    {
        try {
            $module = Module::with('activities')->findOrFail($id);

            return ResponseHelper::success('Activities retrieved successfully.', $module->activities);
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::notFound('Module not found.');
        } catch (Exception $e) {
            return ResponseHelper::serverError('An error occurred while retrieving activities.', $e->getMessage());
        }
    }

    public function getActivity($id, $activity_id)
    {
        try {
            $module = Module::findOrFail($id);
            $activity = $module->activities->findOrFail($activity_id);

            return ResponseHelper::success('Activity retrieved successfully.', $activity);
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::notFound('Module or Activity not found.');
        } catch (Exception $e) {
            return ResponseHelper::serverError('An error occurred while retrieving the activity.', $e->getMessage());
        }
    }

    public function deleteActivity($id, $activity_id)
    {
        try {
            $module = Module::findOrFail($id);
            $activity = $module->activities->findOrFail($activity_id);

            $activity->delete();

            return ResponseHelper::success('Activity deleted successfully.');
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::notFound('Module or Activity not found.');
        } catch (Exception $e) {
            return ResponseHelper::serverError('An error occurred while deleting the activity.', $e->getMessage());
        }
    }

    public function updateActivity(Request $request, $id, $activity_id)
    {
        try {
            $module = Module::findOrFail($id);
            $activity = $module->activities->findOrFail($activity_id);

            $activity->update($request->all());

            return ResponseHelper::success('Activity updated successfully.', $activity);
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::notFound('Module or Activity not found.');
        } catch (ValidationException $e) {
            return ResponseHelper::validationError('Validation failed.', $e->errors());
        } catch (Exception $e) {
            return ResponseHelper::serverError('An error occurred while updating the activity.', $e->getMessage());
        }
    }


    public function addAssignment(Request $request, $id)
    {
        try {
            $module = Module::with('courses')->findOrFail($id);

            $activity = $module->activities()->create([
                'activity_name' => $request->activity_name,
                'type' => 'assignment',
                'start_date' => $request->start_date,
                'start_time' => $request->start_time,
                'end_date' => $request->end_date,
                'end_time' => $request->end_time,
                'instructions' => $request->instructions,
            ]);

            $event = $activity->events()->create([
                'event_name' => $activity->activity_name,
                'start_date' => $activity->start_date,
                'start_time' => $activity->start_time,
                'end_date' => $activity->end_date,
                'end_time' => $activity->end_time,
                'description' => $activity->instructions,
                'status' => 'scheduled',
            ]);

            $userids = $module->courses->flatMap(function ($course) {
                return $course->users->pluck('id');
            })->unique();

            $event->users()->attach($userids);

            return ResponseHelper::success('Assignment added successfully.', [
                'activity' => $activity,
                'event' => $event,
            ]);
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::notFound('Module not found.');
        } catch (Exception $e) {
            return ResponseHelper::serverError('An error occurred while adding the assignment.\n'.$e->getMessage());
        }
    }


    public function addQuiz(Request $request, $id)
    {
        try {
            $module = Module::with('courses')->findOrFail($id);

            $activity = $module->activities()->create([
                'activity_name' => $request->activity_name,
                'type' => 'quiz',
                'start_date' => $request->start_date,
                'start_time' => $request->start_time,
                'end_date' => $request->end_date,
                'end_time' => $request->end_time,
                'question_count' => $request->question_count,
            ]);

            $event = $activity->events()->create([
                'event_name' => $activity->activity_name,
                'start_date' => $activity->start_date,
                'start_time' => $activity->start_time,
                'end_date' => $activity->end_date,
                'end_time' => $activity->end_time,
                'description' => $activity->instructions ?? 'Quiz description.',
                'status' => 'scheduled',
            ]);

            $userids = $module->courses->flatMap(function ($course) {
                return $course->users->pluck('id');
            })->unique();

            $event->users()->attach($userids);

            return ResponseHelper::success('Quiz added successfully.', [
                'activity' => $activity,
                'event' => $event,
            ], 201);
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::error('Module not found.', 404);
        } catch (Exception $e) {
            return ResponseHelper::error('An error occurred while adding the quiz.', 500, $e->getMessage());
        }
    }


    public function createAnnouncement(Request $request, $moduleId)
    {
        try {
            $module = Module::findOrFail($moduleId);

            $request->validate([
                'topic' => 'required|string|max:255',
                'description' => 'required|string',
            ]);

            $announcement = $module->announcements()->create([
                'topic' => $request->topic,
                'description' => $request->description,
            ]);

            return ResponseHelper::success('Announcement created successfully.', $announcement, 201);
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::error('Module not found.', 404);
        } catch (ValidationException $e) {
            return ResponseHelper::validationError('Validation failed.', $e->errors());
        } catch (Exception $e) {
            return ResponseHelper::error('An error occurred while creating the announcement.', 500, $e->getMessage());
        }
    }


    public function getAnnouncements($moduleId)
    {
        try {
            $module = Module::with('announcements')->findOrFail($moduleId);

            return ResponseHelper::success('Announcements retrieved successfully.', $module->announcements, 200);
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::error('Module not found.', 404);
        } catch (Exception $e) {
            return ResponseHelper::error('An error occurred while retrieving the announcements.', 500, $e->getMessage());
        }
    }


    public function updateAnnouncement(Request $request, $announcementId)
    {
        try {
            $announcement = Announcement::findOrFail($announcementId);

            $request->validate([
                'topic' => 'string|max:255|nullable',
                'description' => 'string|nullable',
            ]);

            $announcement->update($request->only('topic', 'description'));

            return ResponseHelper::success('Announcement updated successfully.', $announcement, 200);
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::error('Announcement not found.', 404);
        } catch (ValidationException $e) {
            return ResponseHelper::validationError('Validation failed.', $e->errors());
        } catch (Exception $e) {
            return ResponseHelper::error('An error occurred while updating the announcement.', 500, $e->getMessage());
        }
    }

    public function deleteAnnouncement($announcementId)
    {
        try {
            $announcement = Announcement::findOrFail($announcementId);
            $announcement->delete();

            return ResponseHelper::success('Announcement deleted successfully.', [], 200);
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::error('Announcement not found.', 404);
        } catch (Exception $e) {
            return ResponseHelper::error('An error occurred while deleting the announcement.', 500, $e->getMessage());
        }
    }

    public function addTopic(Request $request, $moduleId)
    {
        try {
            $module = Module::find($moduleId);

            if(!$module) {
                return ResponseHelper::notFound("Module not found");
            }

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'type' => 'nullable|string|in:lecture,assignment,quiz', // Restrict to valid types
                'is_visible' => 'nullable|boolean',
                'deadline' => 'nullable|string', // Optional deadline
            ]);  

            $topic = $module->topics()->create([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'type' => $validated['type'],
                'is_visible' => $validated['is_visible'] ?? true, // Default to true if not provided
                'deadline' => $validated['deadline'] ?? null, // Optional deadline
            ]);

            return ResponseHelper::success('Topic created successfully.', $topic);
        } catch (QueryException $qe) {
            return ResponseHelper::serverError($qe->getMessage());
        } catch (Exception $e) {
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function addLectureMaterial(Request $request, $topicId)
    {
        try {
            $topic = Topic::findOrFail($topicId);

            $validated = $request->validate([
                'material_type' => 'required|string|in:document,video,link', // Restrict to specific types
                'material_title' => 'required|strin g|max:255',
                'material_url' => 'nullable|string',
            ]);

            $material = $topic->lectureMaterials()->create([
                'material_type' => $validated['material_type'],
                'material_title' => $validated['material_title'],
                'material_url' => $validated['material_url'],
            ]);

            return ResponseHelper::success('Lecture Material added successfully.', $material);
        } catch (QueryException $qe) {
            return ResponseHelper::serverError($qe->getMessage());
        } catch (Exception $e) {
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function getTopics($moduleId)
    {
        try {
            $module = Module::with('topics')->findOrFail($moduleId);
            return ResponseHelper::success('Topics retrieved successfully.', $module->topics);
        } catch (QueryException $qe) {
            return ResponseHelper::serverError($qe->getMessage());
        } catch (Exception $e) {
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function getLectureMaterials($topicId)
    {
        try {
            $topic = Topic::with('lectureMaterials')->findOrFail($topicId);
            return ResponseHelper::success('Lecture Materials retrieved successfully.', $topic->lectureMaterials);
        } catch (QueryException $qe) {
            return ResponseHelper::serverError($qe->getMessage());
        } catch (Exception $e) {
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function updateTopic(Request $request, $moduleId, $topicId)
    {
        try {
            $topic = Topic::where('id', $topicId)
                ->where('module_id', $moduleId)
                ->firstOrFail();

            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'type' => 'nullable|string|in:lecture,assignment,quiz',
                'is_visible' => 'nullable|boolean',
            ]);

            $topic->update($validated);

            return ResponseHelper::success('Topic updated successfully.', [
                'topic' => $topic,
            ]);
        } catch (Exception $e) {
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function deleteTopic($moduleId, $topicId)
    {
        try {
            $topic = Topic::where('id', $topicId)
                ->where('module_id', $moduleId)
                ->firstOrFail();

            $topic->delete();

            return ResponseHelper::success('Topic deleted successfully.');
        } catch (Exception $e) {
            return ResponseHelper::serverError($e->getMessage());
        }
    }


}

