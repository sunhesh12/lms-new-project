<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Module;
use App\Models\Resource;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AssignmentController extends Controller
{
    public function create(Request $request, $moduleId)
    {
        if (auth()->user()->isStudent()) {
            abort(403);
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:50',
            'description' => 'required|string|max:100',
            'started' => 'required|date_format:Y-m-d H:i:s|after_or_equal:now',
            'deadline' => 'required|date_format:Y-m-d H:i:s|after_or_equal:now|after:started',
            'resource_file' => 'required|file',
            'resource_caption' => 'required|string|max:50',
            'topic_id' => 'nullable|exists:topics,id',
        ]);

        try {
            $currentModule = Module::find($moduleId);

            if (!$currentModule) {
                return redirect()->back(404)->with('success', false)->with('error', 'Module not found');
            }

            $filePath = Storage::disk('public')->path('/uploads/resources/');
            $fileName = $validatedData['resource_file']->getClientOriginalName();

            if (file_exists($filePath . $fileName)) {
                // unlink($filePath . $fileName);
            }

            $validatedData['resource_file']->move($filePath, $fileName);

            $assignment = $currentModule->assignments()->create([
                'title' => $validatedData['title'],
                'started' => $validatedData['started'],
                'description' => $validatedData['description'],
                'deadline' => $validatedData['deadline'],
                'topic_id' => $validatedData['topic_id'] ?? null,
            ]);

            $resource = $assignment->resources()->create([
                'url' => $fileName,
                'caption' => $validatedData['resource_caption'],
            ]);

            return redirect()->back()->with('success', true)->with('message', 'Successfully created an assignment');
        } catch (Exception $error) {
            return redirect()->back()->with('success', false)->with('message', 'Internal server error');
        }
    }

    public function submit(Request $request, $assignmentId)
    {
        $user = auth()->user();
        if (!$user->isStudent()) {
            abort(403, 'Only students can submit assignments');
        }

        $validatedData = $request->validate([
            'resource_file' => 'required|file|max:10240', // 10MB limit
            'resource_caption' => 'nullable|string|max:100',
        ]);

        try {
            $assignment = Assignment::findOrFail($assignmentId);
            
            // File upload
            $filePath = Storage::disk('public')->path('/uploads/submissions/');
            $fileName = time() . '_' . $validatedData['resource_file']->getClientOriginalName();
            $validatedData['resource_file']->move($filePath, $fileName);

            // Create resource for the submission
            $resource = Resource::create([
                'url' => $fileName,
                'caption' => $validatedData['resource_caption'] ?? 'Submission: ' . $user->name,
            ]);

            // Create submission record
            // Mapping student_id to user_id as per migration
            DB::table('submissions')->insert([
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'student_id' => $user->id,
                'assignment_id' => $assignment->id,
                'resource_id' => $resource->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return redirect()->back()->with('message', 'Assignment submitted successfully!');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Failed to submit assignment: ' . $e->getMessage());
        }
    }

    public function update(Request $request, $assignmentId)
    {
        if (auth()->user()->isStudent()) {
            abort(403);
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:50',
            'description' => 'string|max:100',
            'started' => 'date_format:Y-m-d H:i:s|after_or_equal:now',
            'deadline' => 'date_format:Y-m-d H:i:s|after_or_equal:now|after:started',
            'resource_id' => 'required|string', // For future support for multiple resources
            'resource_file' => 'file',
            'resource_caption' => 'string|max:50',
            'topic_id' => 'nullable|exists:topics,id',
        ]);

        try {
            $currentAssignment = Assignment::find($assignmentId);

            if (!$currentAssignment) {
                return redirect()->back()->with('success', false)->with('message', 'No assignment found')->with('not-found', true);
            }

            if (isset($validatedData['title'])) {
                $currentAssignment->title = $validatedData['title'];
            }

            if (isset($validatedData['description'])) {
                $currentAssignment->description = $validatedData['description'];
            }

            if (isset($validatedData['started'])) {
                $currentAssignment->started = $validatedData['started'];
            }

            if (isset($validatedData['deadline'])) {
                $currentAssignment->deadline = $validatedData['deadline'];
            }

            if (array_key_exists('topic_id', $validatedData)) {
                $currentAssignment->topic_id = $validatedData['topic_id'];
            }

            if (isset($validatedData['resource_file']) || isset($validatedData['resource_caption']) || isset($validatedData['resource_id'])) {
                $resource = $currentAssignment->resources()->find($validatedData['resource_id']);

                if ($resource) {
                    if (isset($validatedData['resource_file'])) {
                        $filePath = Storage::disk('public')->path('/uploads/resources/');
                        $fileName = $validatedData['resource_file']->getClientOriginalName();

                        if (file_exists($filePath . $fileName)) {
                            unlink($filePath . $fileName);
                        }

                        $validatedData['resource_file']->move($filePath, $fileName);


                        $resource->url = $validatedData['resource_file'];
                    }

                    if (isset($validatedData['resource_caption'])) {
                        $resource->caption = $validatedData['resource_caption'];
                    }
                }

                $resource->save();

            }

            $currentAssignment->save();

            return redirect()->back()->with('success', true)->with('message', 'Successfully updated assignment and resources');

        } catch (Exception $error) {
            return redirect()->back()->with('success', false)->with('message', 'Internal server error occured');
        }
    }

    public function delete(Request $request, $assignmentId)
    {
        if (auth()->user()->isStudent()) {
            abort(403);
        }
        try {
            $currentAssignment = Assignment::find($assignmentId);

            if (!$currentAssignment) {
                return redirect()->back()->with('success', false)->with('message', 'Assignment could not be found');
            }

            $currentAssignment->is_deleted = true;

            $resource = $currentAssignment->resources()->first();

            if ($resource) {
                $resource->is_deleted = true;
                $resource->save();
            }

            $currentAssignment->save();

            return redirect()->back()->with('success', true)->with('message', 'Successfully deleted the assignment');

        } catch (Exception $exception) {
            return redirect()->back()->with('success', false)->with('message', 'Internal server error occured')->with('server-error', true)->with('error', $exception->getMessage());
        }

    }

    public function reset(Request $request, $assignmentId)
    {
        if (auth()->user()->isStudent()) {
            abort(403);
        }
        try {
            $currentAssignment = Assignment::find($assignmentId);

            if (!$currentAssignment) {
                return redirect()->back()->with('success', false)->with('message', 'Assignment could not be found');
            }

            $currentAssignment->is_deleted = false;

            $resource = $currentAssignment->resources()->first();

            if ($resource) {
                $resource->is_deleted = false;
                $resource->save();
            }

            $currentAssignment->save();

            return redirect()->back()->with('success', true)->with('message', 'Successfully deleted the assignment');

        } catch (Exception $exception) {
            return redirect()->back()->with('success', false)->with('message', 'Internal server error occured')->with('server-error', true)->with('error', $exception->getMessage());
        }
    }

    public function grading($moduleId, $assignmentId)
    {
        if (!auth()->user()->isLecturer() && !auth()->user()->isAdmin()) {
            abort(403);
        }

        $module = Module::with(['students.user'])->findOrFail($moduleId);
        $assignment = Assignment::findOrFail($assignmentId);
        
        $submissionsWithResources = \Illuminate\Support\Facades\DB::table('submissions')
            ->join('resources', 'submissions.resource_id', '=', 'resources.id')
            ->where('submissions.assignment_id', $assignmentId)
            ->where('submissions.is_deleted', false)
            ->select('submissions.*', 'resources.url as file_url', 'resources.caption as file_caption')
            ->get()
            ->keyBy('student_id');

        $studentsData = $module->students->map(function ($student) use ($submissionsWithResources) {
            $submission = $submissionsWithResources->get($student->user_id);

            return [
                'id' => $student->id, 
                'user_id' => $student->user_id,
                'name' => $student->user->name,
                'avatar' => $student->user->avatar,
                'submission' => $submission,
            ];
        });

        return \Inertia\Inertia::render('Assignments/Grading/Main', [
            'module' => $module,
            'assignment' => $assignment,
            'students' => $studentsData
        ]);
    }

    public function storeGrade(Request $request, $submissionId)
    {
        if (!auth()->user()->isLecturer() && !auth()->user()->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'grade' => 'required|integer|min:0|max:100',
            'feedback' => 'nullable|string|max:1000',
        ]);

        \Illuminate\Support\Facades\DB::table('submissions')
            ->where('id', $submissionId)
            ->update([
                'grade' => $validated['grade'],
                'feedback' => $validated['feedback'],
                'updated_at' => now(),
            ]);

        return redirect()->back()->with('success', true)->with('message', 'Grade saved successfully');
    }

}
